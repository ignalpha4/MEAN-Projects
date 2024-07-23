import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private router:Router){}

  logout(){ 
    alert("user logged out")
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
}
