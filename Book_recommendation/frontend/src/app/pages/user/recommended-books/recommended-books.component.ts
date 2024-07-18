import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-recommended-books',
  templateUrl: './recommended-books.component.html',
  styleUrls: ['./recommended-books.component.scss']
})
export class RecommendedBooksComponent {

  recommendedBooks: any[] = [];
  currentUser : any;
  constructor(private router:Router,private bookService: BookService,private userService:AuthService) {}

  ngOnInit(): void {

    this.userService.getCurrentUser().subscribe((res)=>{
      this.currentUser =  res.user;

      console.log("current user details ",this.currentUser);
      this.fetchBooks(this.currentUser._id);
    })

    
  }

  fetchBooks(id: any): void {
    this.bookService.getRecommendations(id).subscribe(
      (res) => {
        // Shuffle the books array
        const shuffledBooks = this.shuffleArray(res.books);
        // Select the first 10 books from the shuffled array
        this.recommendedBooks = shuffledBooks.slice(0, 8);
      },
      (err) => {
        console.error('Error fetching books:', err);
      }
    );
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  viewBook(bookId: string): void {
    this.router.navigate(['pages/user/dashboard/viewbook', bookId]);
  }

}
