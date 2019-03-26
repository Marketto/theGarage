import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleListComponent } from './views/vehicle-list/vehicle-list.component';
import { NewVehicleComponent } from './views/new-vehicle/new-vehicle.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/vehicles',
    pathMatch: 'full'
  },
  {
    path: 'vehicles',
    component: VehicleListComponent
  },
  {
    path: 'vehicles/new',
    component: NewVehicleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
