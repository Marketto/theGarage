import { Component, OnInit } from '@angular/core';
import { GarageResourceService } from 'src/app/service/garage-resource/garage-resource.service';
import { VehicleInterface } from 'src/app/classes/vehicle.interface';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.pug',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  private vehicles: VehicleInterface[];

  constructor(garageResourceService: GarageResourceService) {
    garageResourceService.find().then((vehicles: VehicleInterface[]) => this.vehicles = vehicles);
  }

  ngOnInit() {
  }

}
