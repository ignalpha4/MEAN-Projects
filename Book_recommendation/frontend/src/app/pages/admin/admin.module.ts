import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageBooksComponent } from './manage-books/manage-books.component';
import { FormsModule } from '@angular/forms';
import { ManageUsersComponent } from './manage-users/manage-users.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ManageBooksComponent,
    ManageUsersComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
