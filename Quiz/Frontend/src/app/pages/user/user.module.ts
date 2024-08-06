import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamComponent } from './exam/exam.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExamHistoryComponent } from './exam-history/exam-history.component';
import { ViewExamComponent } from './view-exam/view-exam.component';
import { ViewStatsComponent } from './view-stats/view-stats.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ExamComponent,
    ExamHistoryComponent,
    ViewExamComponent,
    ViewStatsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
