import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: "", loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: "pages", loadChildren: () => import('./pages/pages-routing.module').then(m => m.PagesRoutingModule),canActivate:[authGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
