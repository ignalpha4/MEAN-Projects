import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-viewbook',
  templateUrl: './viewbook.component.html',
  styleUrls: ['./viewbook.component.scss']
})
export class ViewbookComponent {
  book: any;
  rating: number = 1;
  ratings: number[] = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private userService: AuthService
  ) { }

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    this.bookService.getBookById(bookId).subscribe((data: any) => {
      this.book = data.book;
      console.log(this.book);
      
    });
  }

  rateBook(): void {
    const bookId = this.book._id;
    this.userService.rateBook(bookId, this.rating).subscribe((data: any) => {
      if (data.success) {
        alert('Rating submitted successfully!');
      } else {
        alert('Error submitting rating');
      }
    });
  }
}
