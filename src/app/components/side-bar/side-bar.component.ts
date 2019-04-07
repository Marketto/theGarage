import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GarageConfigService } from 'src/app/service/garage-config/garage-config.service';
import { VehicleType } from 'src/app/classes/vehicle-type.enum';

@Component({
  selector: 'garage-side-bar',
  templateUrl: './side-bar.component.pug',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  public floors: ReadonlyArray<number>;
  public carType: VehicleType = VehicleType.CAR;
  public motorbykeType: VehicleType = VehicleType.MOTORBIKE;
  private $search: string;
  @Output() public searchChange: EventEmitter<string> = new EventEmitter<string>();
  public get search(): string {
    return this.$search;
  }
  public set search(value: string) {
    this.$search = value;
    this.searchChange.emit(this.$search);
  }

  constructor(garageConfigService: GarageConfigService) {
    this.floors = garageConfigService.structure.floors;
  }

  ngOnInit() {
  }

}
