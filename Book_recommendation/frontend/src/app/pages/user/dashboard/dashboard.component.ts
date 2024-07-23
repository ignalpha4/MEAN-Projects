import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  username: any;
  role: any;
  profileImage: any;
  selectedFile: File | null = null;
  showModal: boolean = false;

  constructor(private router: Router, private http: HttpClient, private userService: AuthService) {
    this.userService.getCurrentUser().subscribe((currentUserRes) => {
      this.username = currentUserRes.user.name;
      this.role = currentUserRes.user.role;
      this.profileImage = currentUserRes.user.profileImage;
    });
  }

  logout() {
    localStorage.removeItem('token');
    alert("Logged Out successfully!");
    this.router.navigate(['/login']);
  }

  openUpdateProfileModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files[0];
    }
  }

  submitProfileUpdate() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', this.selectedFile);

      this.userService.updateProfileImage(formData).subscribe((res) => {
        if (res.success) {
          this.profileImage = res.profileImage; // Update the profile image URL
          this.closeModal();
        }
      });
    }
  }
}
