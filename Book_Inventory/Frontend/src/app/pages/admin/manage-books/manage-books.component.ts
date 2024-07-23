import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AuthorService } from 'src/app/core/services/author.service';
import { BookService } from 'src/app/core/services/book.service';
import { CategoryService } from 'src/app/core/services/category.service';

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
  bookImageBase64:any;

  @ViewChild('bookModal') bookModal!: ElementRef;

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private authorService: AuthorService,
    private userService: AuthenticationService,
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

    this.authorService.getData().subscribe((authorRes) => {
      this.authors = authorRes.authors; 
    });

    this.categoryService.getData().subscribe((categoryRes) => {
      this.categories = categoryRes.Category; 
    });

  }

  openAddModal() {
    this.isEditMode = false;
    this.selectedBook = { title: '', author: '', category: '', ISBN: '', description: '', price: '' };
    this.openModal();
  }

  openEditModal(book: any) {
    this.isEditMode = true;
    this.selectedBook = { ...book };
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

    this.selectedBook.bookImage = this.bookImageBase64;

    if (this.isEditMode) {
      this.bookService.updateBook(this.selectedBook._id, this.selectedBook).subscribe((res: any) => {
        if (res.success) {
          alert('Updated Book');
          this.fetchData();
          this.closeModal();
        } else {
          console.log('Error updating the book', res.message);
        }
      });
    } else {
      this.bookService.addBook(this.selectedBook).subscribe((res: any) => {
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
      const reader = new FileReader();
      reader.onload = () => {
        this.bookImageBase64 = reader.result;
      };
      reader.readAsDataURL(file);
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
