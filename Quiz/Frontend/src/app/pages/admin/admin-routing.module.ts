import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddQuestionsComponent } from './add-questions/add-questions.component';
import { ViewQuestionsComponent } from './view-questions/view-questions.component';
import { ExamActivityComponent } from './exam-activity/exam-activity.component';
import { ViewExamComponent } from './view-exam/view-exam.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserStatsComponent } from './user-stats/user-stats.component';

const routes: Routes = [
  {
    path:"",redirectTo:"dashboard",pathMatch:"full"
  },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'addQuestions', component: AddQuestionsComponent },
      { path: 'viewQuestions', component: ViewQuestionsComponent },
      { path: 'users', component: ExamActivityComponent },
      { path: 'viewExam', component: ViewExamComponent },
      { path: 'usersList', component: UsersListComponent },
      { path: 'userStats', component: UserStatsComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
