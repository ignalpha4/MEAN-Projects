import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  username:string = '';

  constructor(private authService:AuthService,private router:Router){
    let user = this.authService.getCurrentUser();
    // this.username = user.name;
  }


  logout(){
    this.authService.logout();
    alert("You are logged Out");
    this.router.navigate(['/login']);
  }

}
