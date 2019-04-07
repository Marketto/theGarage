import { Component, OnInit } from '@angular/core';
import { faCarSide, faMotorcycle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Vehicle } from 'src/app/classes/vehicle.class';
import { VehicleType } from 'src/app/classes/vehicle-type.enum';
import { GarageResourceService } from '../../service/garage-resource/garage-resource.service';

@Component({
  selector: 'garage-new-vehicle',
  templateUrl: './new-vehicle.component.pug',
  styleUrls: ['./new-vehicle.component.scss']
})
export class NewVehicleComponent implements OnInit {
  public carIcon: IconDefinition = faCarSide;
  public motoIcon: IconDefinition = faMotorcycle;
  public newVehicle: Vehicle;
  public carType: VehicleType = VehicleType.CAR;
  public motorbykeType: VehicleType = VehicleType.MOTORBIKE;

  constructor(private garageResource: GarageResourceService) {
    this.cleanVehicle();
  }

  private cleanVehicle() {
    this.newVehicle = new Vehicle();
  }

  /**
   * Save the new vehicle and assign a parking place ticket
   * @param vehicle the vehicle to be assigned to a parking place
   */
  public save() {
    this.garageResource.park(this.newVehicle)
      .then(() => this.cleanVehicle());
    //Goto floor
    //show toast on error
  }

  ngOnInit() {
  }

}
