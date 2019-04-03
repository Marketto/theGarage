import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleListComponent } from './views/vehicle-list/vehicle-list.component';
import { NewVehicleComponent } from './views/new-vehicle/new-vehicle.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/garage',
    pathMatch: 'full'
  },
  {
    path: 'garage',
    children: [
      {
        path: '',
        component: VehicleListComponent
      },
      {
        path: 'level/:floor',
        component: VehicleListComponent
      },
      {
        path: 'vehicle/:type',
        component: VehicleListComponent
      }
    ]
  },
  {
    path: 'new-ticket',
    component: NewVehicleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
