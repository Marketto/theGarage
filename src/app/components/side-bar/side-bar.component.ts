import { Component, OnInit } from '@angular/core';
import { GarageConfigService } from 'src/app/service/garage-config/garage-config.service';
import { VehicleType } from 'src/app/classes/vehicle-type.enum';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.pug',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  public floors: ReadonlyArray<number>;
  public carType: VehicleType = VehicleType.CAR;
  public motorbykeType: VehicleType = VehicleType.MOTORBIKE;

  constructor(garageConfigService: GarageConfigService) {
    this.floors = garageConfigService.structure.floors;
  }

  ngOnInit() {
  }

}
