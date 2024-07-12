import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,
    children:[
      {path:'managecategory',component:ManageCategoryComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
