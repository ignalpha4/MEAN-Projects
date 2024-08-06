import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  username: string = '';
  profileImageUrl: string = '';

  @ViewChild('profileImageInput') profileImageInput!: ElementRef<HTMLInputElement>;

  constructor(private authService: AuthService, private router: Router) {
    this.loadUserData();
  }

  loadUserData() {

    this.authService.getCurrentUser().subscribe((res:any) => {
      this.username = res.user.name;
      this.profileImageUrl ='http://localhost:5000'+ res.user.profileImage;
      console.log("from dashboard",res);
      
    });
  }

  logout() {
    this.authService.logout();
    alert("User logged out!");
    this.router.navigate(['/login']);
  }

  triggerFileInput() {
    this.profileImageInput.nativeElement.click();
  }

  updateProfileImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
