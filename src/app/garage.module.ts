import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './garage-routing.module';
import { AppComponent } from './garage.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { VehicleListComponent } from './views/vehicle-list/vehicle-list.component';
import { NewVehicleComponent } from './views/new-vehicle/new-vehicle.component';
import { ParkingTicketComponent } from './components/parking-ticket/parking-ticket.component';
import { LeaveGarageComponent } from './components/leave-garage/leave-garage.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    SideBarComponent,
    VehicleListComponent,
    NewVehicleComponent,
    ParkingTicketComponent,
    LeaveGarageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    ToastrModule.forRoot()
  ],
  entryComponents: [
    LeaveGarageComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
