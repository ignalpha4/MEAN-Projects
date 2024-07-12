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
    private authService: AuthenticationService
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
          
          this.router.navigate(['/pages/admin/dashboard'])

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
