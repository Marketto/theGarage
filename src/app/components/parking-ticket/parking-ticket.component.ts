import { Component, OnInit, Input } from '@angular/core';
import { faCarSide, faMotorcycle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { VehicleInterface } from 'src/app/classes/vehicle.interface';
import { VehicleType } from 'src/app/classes/vehicle-type.enum';

@Component({
  selector: 'garage-parking-ticket',
  templateUrl: './parking-ticket.component.pug',
  styleUrls: ['./parking-ticket.component.scss']
})
export class ParkingTicketComponent implements OnInit {
  private vehicleIcons = {
    [VehicleType.CAR]: faCarSide,
    [VehicleType.MOTORBIKE]: faMotorcycle
  };
  private $ticket: VehicleInterface;
  public vehicleIcon: IconDefinition;

  @Input()
  public get ticket(): VehicleInterface {
    return this.$ticket;
  }
  public set ticket(ticket: VehicleInterface) {
    this.$ticket = ticket;
    this.vehicleIcon = this.vehicleIcons[ticket.type];
  }

  constructor() { }

  ngOnInit() {
  }

}
