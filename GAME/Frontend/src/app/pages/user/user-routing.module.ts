import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StartGameComponent } from './start-game/start-game.component';
import { GameBoardComponent } from './game-board/game-board.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,
    children:[
    {path:'start-game',component:StartGameComponent},
    {path:'game-board',component:GameBoardComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
