import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent {

  loginData = { email: '', password: '' };
  errormsg!:string;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {

    this.authService.login(this.loginData).subscribe(
      (response) => {
        if(response.success){
          localStorage.setItem('token', response.token); 
          localStorage.setItem('user', JSON.stringify(response.user)); 
  
          alert("Login successfull");
  
          if (response.user.role === 'admin') {
            this.router.navigate(['pages/admin/dashboard']);
          } else if (response.user.role === 'user') {
            this.router.navigate(['pages/user/dashboard']);
          } else {
            console.error('Unknown user role');
          }
        }else{
      
          this.errormsg = response.message;
        }

      },
      (error) => {
        console.error('Login error', error);
      }
    );
  }
}
