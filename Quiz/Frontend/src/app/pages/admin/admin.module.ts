import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddQuestionsComponent } from './add-questions/add-questions.component';
import { ViewQuestionsComponent } from './view-questions/view-questions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ViewExamComponent } from './view-exam/view-exam.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserStatsComponent } from './user-stats/user-stats.component';
import { ExamActivityComponent } from './exam-activity/exam-activity.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    DashboardComponent,
    AddQuestionsComponent,
    ViewQuestionsComponent,
    ViewExamComponent,
    ExamActivityComponent,
    UsersListComponent,
    UserStatsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    AgGridModule,
    HttpClientModule
  ]
})
export class AdminModule { }
