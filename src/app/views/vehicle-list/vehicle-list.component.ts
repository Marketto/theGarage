import { Component, OnInit } from '@angular/core';
import { GarageResourceService } from '../../service/garage-resource/garage-resource.service';
import { VehicleInterface } from '../../classes/vehicle.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleType } from 'src/app/classes/vehicle-type.enum';
import { VehicleOperationService } from '../../service/vehicle-operation/vehicle-operation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'garage-vehicle-list',
  templateUrl: './vehicle-list.component.pug',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  public currentLevel: number;
  public currentType: VehicleType;
  public vehicles: VehicleInterface[] = [];
  public searchCriteria: string;
  public pageStartIndex = 0;
  public pageEndIndex = 0;
  public searchVehicle(searchCriteria: string) {
    this.updateQueryParams(searchCriteria);
  }

  constructor(
    private garageResourceService: GarageResourceService,
    private activatedRoute: ActivatedRoute,
    private vehicleOperationService: VehicleOperationService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  leaveGarage(vehicle: VehicleInterface) {
    return this.vehicleOperationService.leaveGarage(vehicle)
      .then(() => this.garageResourceService.leave(vehicle).catch((err: Error) => this.toastrService.error(err.message)))
      .then(() => this.vehicles.splice(this.vehicles.findIndex((v: VehicleInterface) => v === vehicle), 1))
      .catch(() => {});
  }

  private updateVehicleFilters(vehicles: VehicleInterface[]) {
    const {floor, type} = this.activatedRoute.snapshot.params;
    const {filter} = this.activatedRoute.snapshot.queryParams;
    const level = parseInt(floor, 10);

    this.searchCriteria = filter;
    this.currentLevel = level;
    this.currentType = type;

    this.vehicles = vehicles.filter(vehicle => (
      isNaN(level) || level === vehicle.floor
    ) && (
      !Object.values(VehicleType).includes(type) || type === vehicle.type
    ) && (
      !filter || (new RegExp(filter, 'i')).test(vehicle.plate)
    ));
  }

  private updateQueryParams(searchCriteria) {
    this.router.navigate(['garage'], {
      queryParams: {
        filter: searchCriteria
      },
    //  skipLocationChange: this.activatedRoute.routeConfig.path !== 'garage'
    });
  }

  public navigatePagination({start, end}: {start: number, end: number}) {
    this.pageStartIndex = start;
    this.pageEndIndex = end;
  }

  ngOnInit() {
    this.garageResourceService.find().then((vehicles: VehicleInterface[]) => {
      this.activatedRoute.queryParams.subscribe(() => this.updateVehicleFilters(vehicles));
      this.activatedRoute.params.subscribe(() => this.updateVehicleFilters(vehicles));
    }).catch((err: Error) => this.toastrService.error(err.message));
  }
}
