import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMsg: string = ' ';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.initForm();


  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {

    this.authService.login(this.loginForm.value).subscribe((res: any) => {
      
        if (res.success) {
          alert('Login successful');

          this.loginForm.reset();

          localStorage.setItem('token', res.token);

          this.errorMsg= '';
          
          console.log(res.role);
          
          if(res.role=='user'){
            this.router.navigate(['/pages/user/dashboard'])
          }else{
            this.router.navigate(['/pages/admin/dashboard/managebook'])
          }
          
        } else {
          this.errorMsg = res.message;
        }

      },
      (error) => {   
        console.error('Error:', error);
      }
    );
  }
}
