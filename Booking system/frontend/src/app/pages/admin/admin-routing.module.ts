import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouteCreationComponent } from './route-creation/route-creation.component';
import { BusManagementComponent } from './bus-management/bus-management.component';
import { authGuard } from 'src/app/core/authGuard/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],  data: { roles: ['admin'] },
    children: [
      { path: 'routes', component: RouteCreationComponent },
      { path: 'buses', component: BusManagementComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
