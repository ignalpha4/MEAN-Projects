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

  signupForm!:FormGroup;
  errorMsg:string =''
  constructor(private fb:FormBuilder, private authService:AuthenticationService,private router:Router){
    this.initForm();
  }

  initForm(){
    this.signupForm = this.fb.group(
      {
        name:['',Validators.required],
        email:['',[Validators.required,Validators.email]],
        password:['',Validators.required],
        role:['',Validators.required]
      },

    )
  }

  signup(){

    const formData =this.signupForm.value;

    this.authService.signup(formData).subscribe((res)=>{

      if(res.success){
        alert("signup successfull!");
        this.signupForm.reset();
        this.errorMsg = ''
        this.router.navigate(['/login']);
      }else{
        this.errorMsg = res.message
      }
    },
    (error)=>{
      console.log(error);
    }
    
    )}
}
