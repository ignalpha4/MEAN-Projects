import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';



const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,
    children:[
      {path:'manageProducts',component:ProductListComponent},
      {path:'manageCategories',component:CategoryListComponent},
      {path:'manageSuppliers',component:SupplierListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
