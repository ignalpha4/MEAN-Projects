import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingComponent } from './booking/booking.component';
import { ListbusesComponent } from './listbuses/listbuses.component';
import { authGuard } from 'src/app/core/authGuard/auth.guard';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,
        canActivate: [authGuard],  data: { roles: ['user'] },
    children:[
      {path:'listbuses',component:ListbusesComponent},
      {path:'booking',component:BookingComponent},
      {path:'select-seat',component:SeatSelectionComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
