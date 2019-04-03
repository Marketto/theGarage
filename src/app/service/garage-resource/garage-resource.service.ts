import { Injectable } from '@angular/core';
import { Vehicle } from '../../classes/vehicle.class';
import { GarageConfigService } from '../garage-config/garage-config.service';
import Dexie from 'dexie';
import { ParkingPlaceInterface } from '../../classes/parking-place.interface';
import { VehicleInterface } from 'src/app/classes/vehicle.interface';
import { isNullOrUndefined } from 'util';
@Injectable({
  providedIn: 'root'
})
export class GarageResourceService extends Dexie {
  private vehiclesTable: Dexie.Table<VehicleInterface, number>;
  private garageConfig: GarageConfigService;
  constructor(garageConfigService: GarageConfigService) {
    super('TheGarageDb');
    this.version(1).stores({
      vehicles: Vehicle.dbSchema(),
    });
    this.vehiclesTable = this.table('vehicles');

    this.garageConfig = garageConfigService;
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
    const filters = Object.keys(criteria).filter(param => param !== 'id' && !isNullOrUndefined(criteria[param]));
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
   */
  private findFreeParkingPlaceInFloor(occupiedParkingPlaces: VehicleInterface[], floor: number): ParkingPlaceInterface {
    // const occupiedParkingPlaces: Vehicle[] = await this.find({floor});
    if (occupiedParkingPlaces.length < this.garageConfig.floorParkingPlaces) {
      const place: number = this.garageConfig.structure.places
        .find(parkingPlace => !occupiedParkingPlaces.some((v: Vehicle) => v.place === parkingPlace));
      return { floor, place };
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
    throw new Error(`A Vehicle with plate ${plate} is still parked at floor ${vehicle.floor}, in #${vehicle.place} place`);
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
      const occupiedParkingPlaces: VehicleInterface[] = await this.find();
      const floorPromises: Promise<ParkingPlaceInterface>[] = this.garageConfig.structure.floors
        .map( async floor => this.findFreeParkingPlaceInFloor(occupiedParkingPlaces, floor));
      const parkingPlace: ParkingPlaceInterface = await Promise.race(floorPromises);
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
