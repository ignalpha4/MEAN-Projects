import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent {
  users: any;
  userForm!: FormGroup;
  isEditMode: boolean = false;
  profileImage: File | null = null;
  userId:any;

  @ViewChild('userModal') userModal!: ElementRef;

  constructor(
    private userService: AuthService,
    private renderer: Renderer2,
    private router: Router,
    private fb: FormBuilder,
    private toastr:ToastrService
  ) {}

  ngOnInit() {
    this.initForm();
    this.fetchUsers();
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

  fetchUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data.users;
      console.log(data);
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.userForm.reset({ role: 'user' });
    this.openModal();
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.userId = user._id;
    this.userForm.patchValue({ ...user, password: '' });
    this.openModal();
  }

  openModal() {
    this.renderer.setStyle(this.userModal.nativeElement, 'display', 'block');
    this.renderer.addClass(this.userModal.nativeElement, 'show');
    this.renderer.setAttribute(this.userModal.nativeElement, 'aria-hidden', 'false');
    this.renderer.setAttribute(this.userModal.nativeElement, 'aria-modal', 'true');
  }

  closeModal() {
    this.renderer.setStyle(this.userModal.nativeElement, 'display', 'none');
    this.renderer.removeClass(this.userModal.nativeElement, 'show');
    this.renderer.setAttribute(this.userModal.nativeElement, 'aria-hidden', 'true');
    this.renderer.removeAttribute(this.userModal.nativeElement, 'aria-modal');
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileImage = file;
      this.userForm.patchValue({ profileImage: file });
    }
  }

  saveUser() {
    if (this.userForm.invalid) {
      return;
    }

    const formData = new FormData();

    Object.keys(this.userForm.controls).forEach(key => {
      formData.append(key, this.userForm.get(key)?.value);
    });

    if (this.isEditMode) {
      this.userService.updateUser(this.userId, formData).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('User updated successfully');
          this.fetchUsers();
          this.closeModal();
        } else {
          console.log('Error updating user:', res.message);
          this.toastr.error(res.message);
        }
      });
    } else {
      this.userService.signup(formData).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('User added successfully');
          this.fetchUsers();
          this.closeModal();
        } else {
          console.log('Error adding user:', res.message);
          this.toastr.error(res.message);
        }
      });
    }
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('User deleted successfully');
        this.fetchUsers();
      } else {
        console.log('Error deleting user:', res.message);
        this.toastr.error(res.message);
      }
    });
  }
}
