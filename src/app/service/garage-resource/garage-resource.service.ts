import { Injectable } from '@angular/core';
import { Vehicle } from '../../classes/vehicle.class';
import { GarageConfigService } from '../garage-config/garage-config.service';
import Dexie from 'dexie';
import { ParkingPlaceInterface } from '../../classes/parking-place.interface';
import { VehicleInterface } from '../../classes/vehicle.interface';
import { isNullOrUndefined } from 'util';
@Injectable({
  providedIn: 'root'
})
export class GarageResourceService extends Dexie {
  private vehiclesTable: Dexie.Table<VehicleInterface, number>;
  constructor(
    private garageConfigService: GarageConfigService
  ) {
    super('TheGarageDb');
    this.version(1).stores({
      vehicles: Vehicle.dbSchema(),
    });
    this.vehiclesTable = this.table('vehicles');
  }

  /**
   * Find vehicles in garage for the given criteria, if no filtering params are provided, it will returns the whole list
   * @async
   * @param [criteria={}] filtering criteria
   * @param criteria.id? park ticket id
   * @param criteria.plate? plate number
   * @param criteria.floor? floor number
   * @param criteria.place? parking place number
   * @returns vehicle list
   */
  public async find(criteria: {id?: number, plate?: string, floor?: number, place?: number} = {}): Promise<VehicleInterface[]> {
    const vehicleQuery = isNullOrUndefined(criteria.id) ? this.vehiclesTable : this.vehiclesTable.where({id: criteria.id});
    const filters = Object.keys(criteria)
      .filter((param: string) => param !== 'id' && !isNullOrUndefined(criteria[param]));
    const records = await vehicleQuery.toArray();
    return records.filter((vehicle: VehicleInterface) => !vehicle.leaveDt && !filters.some(param => criteria[param] !== vehicle[param]));
  }

  /**
   * Find vehicles in garage for the given filters, if no filtering params are provided, it will returns the whole list
   * At last a createria (id or plate) is mandatory
   * @async
   * @param criteria filtering criteria
   * @param criteria.id? park ticket id
   * @param criteria.plate? plate number
   * @returns vehicle
   * @throws {Error} Reading error or there's already a vehicle with the given plate in the garage
   */
  public async findOne({id, plate}: {id: number, plate?: string}|{id?: number, plate: string}): Promise<VehicleInterface> {
    const vehicles: VehicleInterface[] = await this.find({id, plate});
    if (!vehicles.length || vehicles.length === 1) {
      return vehicles[0] || null;
    } else {
      throw new Error('Vehicle dupes in db');
    }
  }

  /**
   * Find a free parking place for the given floor number
   * @param occupiedParkingPlaces occupied parking place list
   * @param floor Target floor to seek for a free parking place
   * @returns parking place
   * @throws {Error} Reading error or floor is full
   */
  private findFreeParkingPlaceInFloor(occupiedParkingPlaces: VehicleInterface[], floor: number): ParkingPlaceInterface {
    const occupiedParkingPlacesInFloor: VehicleInterface[] = occupiedParkingPlaces
      .filter((parkedVehicle: VehicleInterface) => parkedVehicle.floor === floor);

    if (occupiedParkingPlacesInFloor.length < this.garageConfigService.floorParkingPlaces) {
      const place: number = this.garageConfigService.structure.places
        .find(parkingPlace => !occupiedParkingPlacesInFloor.some((parkedVehicle: Vehicle) => parkedVehicle.place === parkingPlace));
      return { floor, place } as ParkingPlaceInterface;
    }
    throw new Error(`Floor ${floor} is full`);
  }

  /**
   * Check if the given plate is already present in the garage
   * Resolves if NOT present
   * Reject if it's a duplicate
   * @async
   * @param plate Vehicle Plate number
   * @returns Vehicle plate if NOT used in the garage
   */
  private async checkPlateNotInGarage(plate: string): Promise<string> {
    const vehicle: VehicleInterface = await this.findOne({plate});
    if (!vehicle) {
      return plate;
    }
    throw new Error(`A Vehicle with plate ${plate} is still parked at floor ${vehicle.floor}, in place #${vehicle.place}`);
  }

  /**
   * Perform a parallel check on each garage floor seeking for a free parking place
   * @async
   * @returns Free Parking place informations
   * @throws Reading error or the garage is full (all floors resolve being full)
   */
  private async seekFirstAvailableParkingPlace(): Promise<ParkingPlaceInterface> {
    // Retrieving all vehicles
    const occupiedParkingPlaces: VehicleInterface[] = await this.find();
    // Creating a list of promises to catch all full floors (reversing promises)
    const fullFloorPrimises: Promise<ParkingPlaceInterface>[] = this.garageConfigService.structure.floors
        .map( async (floor: number) => {
          let result: ParkingPlaceInterface;
          try {
            result = this.findFreeParkingPlaceInFloor(occupiedParkingPlaces, floor);
          } catch (failure) {
            return failure;
          }
          throw result;
        });
    // Resolving all full-floor promises in parallel:
    // If all will resolves then the garage is full
    // The first one which will stop the flow would throw a free parking place
    return new Promise((resolve, reject) => Promise.all(fullFloorPrimises)
      .then(() => reject(new Error('The garage is full'))) // All floors were checked and are full
      .catch(resolve) // One of the promises threw a free parking place, blocking the whole flow
    );
  }

  /**
   * Assign a prking place (floor and place number) to the given vehicle
   * @async
   * @param vehicle Target vehicle to assign a parking place to
   * @returns provided vehicle enriched with the assigned parking place (floor and place number)
   */
  public async park(vehicle: Vehicle): Promise<Vehicle> {
    return await this.transaction('rw', this.vehiclesTable, async () => {
      await this.checkPlateNotInGarage(vehicle.plate);

      const parkingPlace = await this.seekFirstAvailableParkingPlace();

      Object.assign(vehicle, parkingPlace, {
        enterDt: new Date()
      });
      vehicle.id = await this.vehiclesTable.add(vehicle.exportDbEntry());
      return vehicle;
    });
  }

  /**
   * Leave a prking place for the given vehicle, by id or plate, assigning to it a leave dateTime
   * @async
   * @param vehicle Target vehicle to assign a parking place to
   * @returns provided vehicle enriched with the leaving timestamp
   */
  public async leave({id = null, plate = null}: {id: number, plate?: string}|{id?: number, plate: string}): Promise<VehicleInterface> {
    return await this.transaction('rw', this.vehiclesTable, async () => {
      const vehicle: VehicleInterface = await this.findOne({id, plate});
      if (!vehicle) {
        throw new Error(`No vehicle currently parked for the given id/plate "${id || plate}"`);
      }
      const ticketExpiration = {leaveDt: new Date()};
      await this.vehiclesTable.update(vehicle.id, ticketExpiration);
      return Object.assign(vehicle, ticketExpiration);
    });
  }
}
