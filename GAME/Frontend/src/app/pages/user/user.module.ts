import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StartGameComponent } from './start-game/start-game.component';
import { GameBoardComponent } from './game-board/game-board.component';



@NgModule({
  declarations: [
    DashboardComponent,
    StartGameComponent,
    GameBoardComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
