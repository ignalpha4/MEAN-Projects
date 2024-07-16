import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup;
  errorMsg: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      profileImage: ['']
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.signupForm.patchValue({ profileImage: file });
    }
  }

  signup() {
    const formData = new FormData();
    Object.keys(this.signupForm.controls).forEach(key => {
      formData.append(key, this.signupForm.get(key)?.value);
    });

    this.authService.signup(formData).subscribe(
      (res) => {
        if (res.success) {
          alert('Signup successful!');
          this.signupForm.reset();
          this.errorMsg = '';
          this.router.navigate(['/login']);
        } else {
          this.errorMsg = res.message;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
