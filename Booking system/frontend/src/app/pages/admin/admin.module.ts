import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouteCreationComponent } from './route-creation/route-creation.component';
import { BusManagementComponent } from './bus-management/bus-management.component';


@NgModule({
  declarations: [
  
    DashboardComponent,
       RouteCreationComponent,
       BusManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    AgGridAngular,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
