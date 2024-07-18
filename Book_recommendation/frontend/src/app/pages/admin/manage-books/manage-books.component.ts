import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.scss']
})
export class ManageBooksComponent {
  books: any ;
  authors: any;
  categories: any;
  selectedBook: any = { title: '', author: '', category: '', ISBN: '', description: '', price: '' };
  isEditMode: boolean = false;
  bookImageFile: File | null = null;

  @ViewChild('bookModal') bookModal!: ElementRef;

  constructor(
    private bookService: BookService,
    private userService: AuthService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.bookService.getData().subscribe((bookRes) => {
      this.books = bookRes.books;
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.selectedBook = { title: '', author: '', category: '', ISBN: '', description: '', price: '' };
    this.bookImageFile = null;
    this.openModal();
  }

  openEditModal(book: any) {
    this.isEditMode = true;
    this.selectedBook = { ...book };
    this.bookImageFile = null;  // Reset the image file for edit mode
    this.openModal();
  }

  openModal() {
    this.renderer.setStyle(this.bookModal.nativeElement, 'display', 'block');
    this.renderer.addClass(this.bookModal.nativeElement, 'show');
    this.renderer.setAttribute(this.bookModal.nativeElement, 'aria-hidden', 'false');
    this.renderer.setAttribute(this.bookModal.nativeElement, 'aria-modal', 'true');
  }

  closeModal() {
    this.renderer.setStyle(this.bookModal.nativeElement, 'display', 'none');
    this.renderer.removeClass(this.bookModal.nativeElement, 'show');
    this.renderer.setAttribute(this.bookModal.nativeElement, 'aria-hidden', 'true');
    this.renderer.removeAttribute(this.bookModal.nativeElement, 'aria-modal');
  }

  saveBook() {
    const formData = new FormData();
    Object.keys(this.selectedBook).forEach(key => {
      formData.append(key, this.selectedBook[key]);
    });
    if (this.bookImageFile) {
      formData.append('bookImage', this.bookImageFile);
    }

    if (this.isEditMode) {
      this.bookService.updateBook(this.selectedBook._id, formData).subscribe((res: any) => {
        if (res.success) {
          alert('Updated Book');
          this.fetchData();
          this.closeModal();
        } else {
          console.log('Error updating the book', res.message);
        }
      });
    } else {
      this.bookService.addBook(formData).subscribe((res: any) => {
        if (res.success) {
          alert('Added Book');
          this.fetchData();
          this.closeModal();
        } else {
          console.log('Error adding the book');
        }
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.bookImageFile = file;
    }
  }

  deleteBook(_id: string) {
    this.bookService.deleteBook(_id).subscribe((res: any) => {
      if (res.success) {
        alert('Book Deleted!');
        this.fetchData();
      } else {
        alert('Error deleting book!');
        console.log(res);
      }
    }, (error) => {
      console.log(error);
    });
  }
}
