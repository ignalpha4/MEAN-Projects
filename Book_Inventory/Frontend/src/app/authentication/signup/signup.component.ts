import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm!: FormGroup;
  errorMsg: string = '';
  profileImageBase64: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageBase64 = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  signup() {
    const formData = this.signupForm.value;
    formData.profileImage = this.profileImageBase64;

    this.authService.signup(formData).subscribe(
      (res) => {
        if (res.success) {
          alert("Signup successful!");
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
