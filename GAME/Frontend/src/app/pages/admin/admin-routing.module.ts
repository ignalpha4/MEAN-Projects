import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { GamesInfoComponent } from './games-info/games-info.component';
import { ViewGameComponent } from './view-game/view-game.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,
    children:[
      {path:'manageusers',component:ManageUsersComponent},
      {path:'games-info',component:GamesInfoComponent},
      {path:'view-game',component:ViewGameComponent}
  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
