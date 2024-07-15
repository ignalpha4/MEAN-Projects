import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageAuthorComponent } from './manage-author/manage-author.component';
import { ManageBooksComponent } from './manage-books/manage-books.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,
    children:[
      {path:'managecategory',component:ManageCategoryComponent},
      {path:'manageauthor',component:ManageAuthorComponent},
      {path:'managebook',component:ManageBooksComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
