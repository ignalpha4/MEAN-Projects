import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  profileImage!: File;
  emailError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      profileImage:['']
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
       (response) => {
        if (response.status) {
          alert("Sign Up Done!");
          this.router.navigate(['/login']);
        } else {
          this.emailError = "Email already registered";
        }
        console.log(response);
        
      }
    )};
}

