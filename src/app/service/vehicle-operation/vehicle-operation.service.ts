import { Injectable, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleInterface } from '../../classes/vehicle.interface';
import { LeaveGarageComponent } from 'src/app/components/leave-garage/leave-garage.component';

@Injectable({
  providedIn: 'root'
})
export class VehicleOperationService {

  constructor(private ngbModal: NgbModal) { }

  public leaveGarage(vehicle: VehicleInterface) {
    const modalInstance = this.ngbModal.open(LeaveGarageComponent, {
      centered: true
    });

    const componentInstance: LeaveGarageComponent = modalInstance.componentInstance;

    componentInstance.ticket = vehicle;

    return modalInstance.result;
  }
}
