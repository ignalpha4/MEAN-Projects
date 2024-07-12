import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-author-signup',
  templateUrl: './author-signup.component.html',
  styleUrls: ['./author-signup.component.scss']
})
export class AuthorSignupComponent{

  authorSignupForm!:FormGroup;
  errorMsg:string =''
  constructor(private fb:FormBuilder, private authService:AuthenticationService,private router:Router){
    this.initForm();
  }

  initForm(){
    this.authorSignupForm = this.fb.group(
      {
        name:['',Validators.required],
        email:['',[Validators.required,Validators.email]],
        password:['',Validators.required],
        role:['',Validators.required],
        biography:['',Validators.required],
        nationality:['',Validators.required]
      },

    )
  }

  signup(){

    const formData =this.authorSignupForm.value;

    this.authService.authorSignup(formData).subscribe((res)=>{

      if(res.success){
        alert("signup successfull!");
        this.authorSignupForm.reset();
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