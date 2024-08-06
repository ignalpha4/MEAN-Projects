import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamComponent } from './exam/exam.component';
import { ExamHistoryComponent } from './exam-history/exam-history.component';
import { ViewExamComponent } from './view-exam/view-exam.component';
import { ViewStatsComponent } from './view-stats/view-stats.component';

const routes: Routes = [
  {path:"",redirectTo:"dashboard",pathMatch:"full"},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'exam', component: ExamComponent },
  { path: 'examHistory', component: ExamHistoryComponent },
  { path: 'viewExam', component: ViewExamComponent },
  { path: 'viewStats', component: ViewStatsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
