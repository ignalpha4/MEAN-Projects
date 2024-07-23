import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AuthorService } from 'src/app/core/services/author.service';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-manage-author',
  templateUrl: './manage-author.component.html',
  styleUrls: ['./manage-author.component.scss']
})
export class ManageAuthorComponent {
  authors: any;
  profileImageBase64:any;
  selectedAuthor: any = { name: '',email:'',password:'',biography:'',nationality:'' };
  isEditMode: boolean = false;

  @ViewChild('authorModal') authorModal!: ElementRef;

  constructor(private authorService: AuthorService,private userService:AuthenticationService, private renderer: Renderer2,private router:Router) {}

  ngOnInit() {
    this.fetchAuthors();
  }

  fetchAuthors() {
    this.authorService.getData().subscribe((authorRes) => {
      const authors = authorRes.authors;
      
      this.userService.getUsers().subscribe((userRes) => {
        const users = userRes.users;

     
        this.authors = authors.map((author: any) => {
          const user = users.find((u: any) => u._id === author.userId);
          if (user) {
            author.email = user.email;
            author.password = user.password; 
          }
          return author;
        });

        console.log(this.authors); 
      });
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.selectedAuthor =  { name: '',email:'',password:'',biography:'',nationality:'' };
    this.openModal();
  }

  openEditModal(author: any) {
    this.isEditMode = true;
    this.selectedAuthor = { ...author };
    this.openModal();
  }

  openModal() {
    this.renderer.setStyle(this.authorModal.nativeElement, 'display', 'block');
    this.renderer.addClass(this.authorModal.nativeElement, 'show');
    this.renderer.setAttribute(this.authorModal.nativeElement, 'aria-hidden', 'false');
    this.renderer.setAttribute(this.authorModal.nativeElement, 'aria-modal', 'true');
  }

  closeModal() {
    this.renderer.setStyle(this.authorModal.nativeElement, 'display', 'none');
    this.renderer.removeClass(this.authorModal.nativeElement, 'show');
    this.renderer.setAttribute(this.authorModal.nativeElement, 'aria-hidden', 'true');
    this.renderer.removeAttribute(this.authorModal.nativeElement, 'aria-modal');
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageBase64 = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveAuthor() {

    //ading profile img field to the current authorprofile obj
    
    this.selectedAuthor.profileImage = this.profileImageBase64;

    if (this.isEditMode) {
      this.authorService.updateAuthor(this.selectedAuthor._id, this.selectedAuthor).subscribe((res: any) => {
        if (res.success) {
          alert('Updated Author');
          this.fetchAuthors();
          this.closeModal();
        } else {
          console.log('Error updating the Author',res.message);
        } 
      });
    } else {
      this.authorService.addAuthor(this.selectedAuthor).subscribe((res: any) => {
        if (res.success) {  
          alert('Added Author');
          this.fetchAuthors();
          this.closeModal();
        } else {
          console.log('Error adding the Author');
        }
      });
    }
  }

  deleteAuthor(_id: string) {
    this.authorService.deleteAuthor(_id).subscribe((res:any) => {

      if (res.success) {
        alert('Author and his details Deleted!');
  
        //if author delets his profile
        if(res.authorDeleted){
          this.router.navigate(['/login']);
          localStorage.removeItem('token');
        }else{
          this.fetchAuthors();
        }

      } else {
        alert('Error deleting author!');
        console.log(res);
        
      }
    }, (error) => {
      console.log(error);
    });
  }
}
