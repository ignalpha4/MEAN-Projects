import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'user',loadChildren:()=>import('./user/user.module').then((m)=>m.UserModule)},
  {path:'admin',loadChildren:()=>import('./admin/admin.module').then((m)=>m.AdminModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
