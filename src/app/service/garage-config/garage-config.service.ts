import { Injectable } from '@angular/core';
import * as GARAGE_CONFIG from '../../../assets/garage.json';
import { VehicleType } from 'src/app/classes/vehicle-type.enum.js';

@Injectable({
  providedIn: 'root'
})
export class GarageConfigService {
  public floors: number;
  public floorParkingPlaces: number;
  public structure: {
    floors: ReadonlyArray<number>,
    places: ReadonlyArray<number>
  };
  public pricePerHour: {
    [VehicleType: string]: number
  };

  constructor() {
    Object.assign(this, GARAGE_CONFIG.default);
    this.structure = Object.freeze({
      floors: (new Array(this.floors)).fill(null).map((v, id: number) => id),
      places: (new Array(this.floorParkingPlaces)).fill(null).map((v, id) => id)
    });
  }
}
