import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorSignupComponent } from './author-signup/author-signup.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    AuthorSignupComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AuthenticationModule { }
