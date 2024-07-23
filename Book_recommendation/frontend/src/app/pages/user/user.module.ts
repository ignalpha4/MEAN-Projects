import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListbooksComponent } from './listbooks/listbooks.component';
import { ViewbookComponent } from './viewbook/viewbook.component';
import { FormsModule } from '@angular/forms';
import { RecommendedBooksComponent } from './recommended-books/recommended-books.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ListbooksComponent,
    ViewbookComponent,
    RecommendedBooksComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule
  ]
})
export class UserModule { }
