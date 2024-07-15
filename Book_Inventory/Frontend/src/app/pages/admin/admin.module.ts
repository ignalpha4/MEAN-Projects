import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageAuthorComponent } from './manage-author/manage-author.component';
import { ManageBooksComponent } from './manage-books/manage-books.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ManageCategoryComponent,
    ManageAuthorComponent,
    ManageBooksComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
  ]
})
export class AdminModule { }
