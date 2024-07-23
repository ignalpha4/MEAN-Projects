import { Component } from '@angular/core';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-listbooks',
  templateUrl: './listbooks.component.html',
  styleUrls: ['./listbooks.component.scss']
})
export class ListbooksComponent {
  books: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchBooks();

    
  }

  fetchBooks(): void {
    this.bookService.getData().subscribe(
      (res) => {
        this.books = res.books;
      },
      (err) => {
        console.error('Error fetching books:', err);
      }
    );
  }
}
