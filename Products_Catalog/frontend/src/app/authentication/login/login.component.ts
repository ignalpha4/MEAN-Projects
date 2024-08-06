import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  errorMsg:string='';

  loginForm!:FormGroup;

  constructor(private fb:FormBuilder,private authService:AuthService,private router:Router){}

  ngOnInit(){
    this.initForm();
  }

  initForm(){
    this.loginForm = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required],
    })
  }

  login(){
    let loginUser  = this.loginForm.value;

    if(this.authService.userLogin(loginUser)){

      this.authService.setCurrentUser(loginUser);

      let user =  this.authService.getCurrentUser();

      if(user.role==='admin'){
        alert("Admin Login Successfull ! ");
        this.router.navigate(['/pages/admin/dashboard/manageProducts']);
      }
      if(user.role==='user'){
        alert('User login successfull !');
        this.router.navigate(['/pages/user/dashboard/products']);
      }
      
    }else{
      this.errorMsg = 'incorrect credentials';
      console.log(this.errorMsg);
    }
  }
  
}
