import { Component, OnInit } from '@angular/core';
import { faCarSide, faMotorcycle, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-new-vehicle',
  templateUrl: './new-vehicle.component.pug',
  styleUrls: ['./new-vehicle.component.scss']
})
export class NewVehicleComponent implements OnInit {

  constructor() { }
  public carIcon: IconDefinition = faCarSide;
  public motoIcon: IconDefinition = faMotorcycle;

  ngOnInit() {
  }

}
