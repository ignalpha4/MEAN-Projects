import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  useremail: any;
  username: any;
  role: any;
  profileImage: any;
  selectedFile: File | null = null;
  showModal: boolean = false;
  userForm!: FormGroup;
  isEditMode: boolean = true; // Profile edit mode

  @ViewChild('userModal') userModal!: ElementRef;

  constructor(private router: Router, private userService: AuthService,private toastr:ToastrService, private fb: FormBuilder, private renderer: Renderer2) {
    this.userService.getCurrentUser().subscribe((currentUserRes) => {
      this.username = currentUserRes.user.name;
      this.useremail = currentUserRes.user.email;
      this.role = currentUserRes.user.role;
      this.profileImage = currentUserRes.user.profileImage;
      this.initForm();
      this.userForm.patchValue({
        name: this.username,
        email: this.useremail,
        role: this.role
      });
    });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      profileImage: ['']
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.toastr.success("Logged Out successfully!");
    this.router.navigate(['/login']);
  }

  openUpdateProfileModal() {
    this.isEditMode = true;
    this.openModal();
  }

  closeModal() {
    this.renderer.setStyle(this.userModal.nativeElement, 'display', 'none');
    this.renderer.removeClass(this.userModal.nativeElement, 'show');
    this.renderer.setAttribute(this.userModal.nativeElement, 'aria-hidden', 'true');
    this.renderer.removeAttribute(this.userModal.nativeElement, 'aria-modal');
  }

  openModal() {
    this.renderer.setStyle(this.userModal.nativeElement, 'display', 'block');
    this.renderer.addClass(this.userModal.nativeElement, 'show');
    this.renderer.setAttribute(this.userModal.nativeElement, 'aria-hidden', 'false');
    this.renderer.setAttribute(this.userModal.nativeElement, 'aria-modal', 'true');
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.userForm.patchValue({ profileImage: file });
    }
  }

  submitProfileUpdate() {
    if (this.userForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.userForm.controls).forEach(key => {
      formData.append(key, this.userForm.get(key)?.value);
    });

    this.userService.updateProfileImage(formData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Profile updated successfully');
        this.profileImage = res.profileImage; 
        this.username = this.userForm.get('name')?.value;
        this.closeModal();
      } else {
        console.log('Error updating profile:', res.message);
        this.toastr.error(res.message);
      }
    });
  }
}
