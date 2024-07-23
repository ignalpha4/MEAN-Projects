import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  useremail: any;
  role: any;
  profileImage: any;
  selectedFile: File | null = null;
  showModal: boolean = false;

  constructor(private router: Router, private http: HttpClient, private userService: AuthenticationService) {
    this.userService.getCurrentUser().subscribe((currentUserRes) => {
      console.log(currentUserRes);
      this.useremail = currentUserRes.user.email;
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
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.profileImage = base64Image;
        this.userService.updateProfileImage({ profileImage: base64Image }).subscribe(() => {
          this.closeModal();
        });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
