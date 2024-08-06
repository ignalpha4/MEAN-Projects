import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  errorMsg:String ='';
  signupForm!:FormGroup;

  constructor(private fb:FormBuilder,private authService:AuthService,private router:Router ){}

  ngOnInit(){
    this.initForm();
  }

  initForm(){
    this.signupForm = this.fb.group({
      name:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required],
      role:['',Validators.required]
    })
  }

  signup(){
    let newUser =  this.signupForm.value;
    if(this.authService.addUser(newUser)){
      alert("Sign Up Successfull");
      this.router.navigate(['/login'])
    }else{
      this.errorMsg = "User with this email already exists";
    }
  }
}
