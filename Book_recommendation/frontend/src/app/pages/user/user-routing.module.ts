import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListbooksComponent } from './listbooks/listbooks.component';
import { ViewbookComponent } from './viewbook/viewbook.component';
import { RecommendedBooksComponent } from './recommended-books/recommended-books.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,
    children:[
      {path:'listbooks',component:ListbooksComponent},
      {path:'viewbook/:id',component:ViewbookComponent},
      {path:'recommendedbooks',component:RecommendedBooksComponent}
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
