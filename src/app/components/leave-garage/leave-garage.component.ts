import { Component, OnInit, Input, Output } from '@angular/core';
import { VehicleInterface } from 'src/app/classes/vehicle.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleType } from 'src/app/classes/vehicle-type.enum';
import { faCarSide, faMotorcycle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { GarageConfigService } from 'src/app/service/garage-config/garage-config.service';

@Component({
  selector: 'garage-leave-garage',
  templateUrl: './leave-garage.component.pug',
  styleUrls: ['./leave-garage.component.scss']
})
export class LeaveGarageComponent implements OnInit {
  public $ticket: VehicleInterface;
  public price: number;
  private vehicleIcons = {
    [VehicleType.CAR]: faCarSide,
    [VehicleType.MOTORBIKE]: faMotorcycle
  };
  public vehicleIcon: IconDefinition;

  @Input()
  public get ticket(): VehicleInterface {
    return this.$ticket;
  }
  public set ticket(ticket: VehicleInterface) {
    this.$ticket = ticket;
    this.vehicleIcon = this.vehicleIcons[ticket.type];
    this.price = Math.ceil(moment().diff(ticket.enterDt, 'minute') / 60) * this.garageConfigService.pricePerHour[ticket.type];
  }

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private garageConfigService: GarageConfigService
  ) { }

  public cancel() {
    this.ngbActiveModal.dismiss();
  }

  public confirm() {
    this.ngbActiveModal.close();
  }

  ngOnInit() {
  }

}
