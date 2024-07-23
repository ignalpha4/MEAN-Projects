import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupData = { name: '', email: '', password: '', role: 'user' ,gender:''};

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.signup(this.signupData).subscribe(
      response => {
        alert("signup done")
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Signup error', error);
      }
    );
  }
}
