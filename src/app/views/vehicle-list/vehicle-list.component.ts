import { Component, OnInit } from '@angular/core';
import { GarageResourceService } from '../../service/garage-resource/garage-resource.service';
import { VehicleInterface } from '../../classes/vehicle.interface';
import { ActivatedRoute } from '@angular/router';
import { VehicleType } from 'src/app/classes/vehicle-type.enum';
import { VehicleOperationService } from '../../service/vehicle-operation/vehicle-operation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'garage-vehicle-list',
  templateUrl: './vehicle-list.component.pug',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  public vehicles: VehicleInterface[];

  constructor(
    private garageResourceService: GarageResourceService,
    private activatedRoute: ActivatedRoute,
    private vehicleOperationService: VehicleOperationService,
    private toastrService: ToastrService
  ) {}

  leaveGarage(vehicle: VehicleInterface) {
    return this.vehicleOperationService.leaveGarage(vehicle)
      .then(() => this.garageResourceService.leave(vehicle).catch((err: Error) => this.toastrService.error(err.message)))
      .then(() => this.vehicles.splice(this.vehicles.findIndex((v: VehicleInterface) => v === vehicle), 1))
      .catch(() => {});
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
    }).catch((err: Error) => this.toastrService.error(err.message));
  }
}
