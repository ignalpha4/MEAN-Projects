import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { QuestionsService } from 'src/app/core/services/questions.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  username!: string;
  profileImageUrl!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private questionService: QuestionsService,
    private http: HttpClient
  ) {
    this.loadUserData();
  }

  loadUserData() {

    this.authService.getCurrentUser().subscribe((res:any) => {
      this.username = res.user.name;
      this.profileImageUrl ='http://localhost:5000'+ res.user.profileImage;
      console.log("from dashboard",res);
      
    });
  }

  ngOnInit() {
   
  }

  logout() {
    this.authService.logout();
      alert("Logged Out successfully!");
      this.router.navigate(['/login']);
    } 
}

