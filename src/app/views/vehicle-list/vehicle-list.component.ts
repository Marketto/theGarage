import { Component, OnInit } from '@angular/core';
import { GarageResourceService } from 'src/app/service/garage-resource/garage-resource.service';
import { VehicleInterface } from 'src/app/classes/vehicle.interface';
import { ActivatedRoute } from '@angular/router';
import { VehicleType } from 'src/app/classes/vehicle-type.enum';
import { isNumber } from 'util';

@Component({
  selector: 'garage-vehicle-list',
  templateUrl: './vehicle-list.component.pug',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  private garageResourceService: GarageResourceService;
  private activatedRoute: ActivatedRoute;
  public vehicles: VehicleInterface[];

  constructor(garageResourceService: GarageResourceService, activatedRoute: ActivatedRoute) {
    this.garageResourceService = garageResourceService;
    this.activatedRoute = activatedRoute;
  }

  ngOnInit() {
    this.garageResourceService.find().then((vehicles: VehicleInterface[]) => {
      this.activatedRoute.params.subscribe(({floor, type}: {floor: string, type: string} = {floor: null, type: null}) => {
        const level = parseInt(floor, 10);
        this.vehicles = vehicles.filter(vehicle => (
          isNaN(level) || level === vehicle.floor
        ) && (
          !Object.values(VehicleType).includes(type) || type === vehicle.type
        ));
      });
    });
  }
}
