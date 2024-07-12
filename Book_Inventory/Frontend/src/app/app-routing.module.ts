import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',loadChildren:()=>import('./authentication/authentication.module').then(m=>m.AuthenticationModule)},
  {path:'pages',loadChildren:()=>import('./pages/pages.module').then(m=>m.PagesModule)},
  {path:'**',redirectTo:"login"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
