import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AgGridAngular } from 'ag-grid-angular';
import { GamesInfoComponent } from './games-info/games-info.component';
import { ViewGameComponent } from './view-game/view-game.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ManageUsersComponent,
    GamesInfoComponent,
    ViewGameComponent
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
