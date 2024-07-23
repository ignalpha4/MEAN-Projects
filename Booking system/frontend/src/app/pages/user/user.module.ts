import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingComponent } from './booking/booking.component';
import { ListbusesComponent } from './listbuses/listbuses.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';



@NgModule({
  declarations: [
    DashboardComponent,
    BookingComponent,
    ListbusesComponent,
    SeatSelectionComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
