import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  incorrectCred: string = '';

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    const loginUser = this.loginForm.value;

    this.authService.login(loginUser).subscribe((response) =>{
      if (response.status) {
      
             localStorage.setItem('token', response.token);

              if (response.user.role === 'admin') {
                alert("Admin Logged In!");
                this.router.navigate(['/pages/admin/dashboard/addQuestions']);
              } else if (response.user.role === 'user') {
                alert('User Logged In!');
                this.router.navigate(['/pages/user/dashboard']);
              }
      }else{
        this.incorrectCred = response.message;
        console.log(response);
        
      }
      },
      (error:any)=>{
        console.log(error.message);
        this.incorrectCred = error.message;
      }
  )}
}
