import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

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
    private authService: AuthService,
    private toastr:ToastrService
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
          
          this.toastr.success('Login Done')

          this.loginForm.reset();

          localStorage.setItem('token', res.token);

          this.errorMsg= '';
          
          
          if(res.role=='user'){
            this.router.navigate(['/pages/user/dashboard/start-game'])
          }else{
            this.router.navigate(['/pages/admin/dashboard'])
          }
          
        } else {
          this.errorMsg = res.message;
          this.toastr.error(res.message);
        }

      },
      (error:any) => {   
        console.error('Error:', error);
        this.toastr.error(error.message);
      }
    );
  }
}