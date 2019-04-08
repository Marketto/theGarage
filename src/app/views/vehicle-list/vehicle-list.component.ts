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

  private filterVehicleList(vehicles: VehicleInterface[]) {
    const {floor, type} = this.activatedRoute.snapshot.params;
    const {filter} = this.activatedRoute.snapshot.queryParams;
    const level = parseInt(floor, 10);

    this.vehicles = vehicles.filter(vehicle => (
      isNaN(level) || level === vehicle.floor
    ) && (
      !Object.values(VehicleType).includes(type) || type === vehicle.type
    ) && (
      !filter || (new RegExp(filter, 'i')).test(vehicle.plate)
    ));
  }

  ngOnInit() {
    this.garageResourceService.find().then((vehicles: VehicleInterface[]) => {
      this.activatedRoute.queryParams.subscribe(() => this.filterVehicleList(vehicles));
      this.activatedRoute.params.subscribe(() => this.filterVehicleList(vehicles));
    }).catch((err: Error) => this.toastrService.error(err.message));
  }
}
