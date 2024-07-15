import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListbooksComponent } from './listbooks/listbooks.component';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    DashboardComponent,
    ListbooksComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    AgGridModule
  ]
})
export class UserModule { }
