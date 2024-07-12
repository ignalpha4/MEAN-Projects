import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  username: any;
  profileImageUrl: any;
  selectedFile: File | null = null;
  showModal: boolean = false;

  
  constructor( private router: Router, private http: HttpClient) {
    // let user = this.authService.getCurrentUser();
    // this.username = user.name;
    // this.profileImageUrl = user.profileImage;
  }

  logout() {
    // this.authService.logout();
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
        this.profileImageUrl = base64Image;
        this.closeModal()
        // this.authService.updateProfileImage(base64Image);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}

