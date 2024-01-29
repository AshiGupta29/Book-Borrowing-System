import { Component, ElementRef, ViewChild } from '@angular/core';
import { Book } from '../shared/models/book';
import { BookParams } from '../shared/models/bookParams';
import { BookService } from '../core/services/book.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../core/services/account.service';
import { Observable, of, switchMap } from 'rxjs';
import { BookCreate } from '../shared/models/bookCreate';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent {
  @ViewChild('search') searchTerm?: ElementRef;
  books: Book[] =[];
  allBooks: Book[] =[];
  lentedBooks: Book[] = [];
  bookParams = new BookParams();
  closeResult = '';
  selectedBook: Book | null = null;
  userId : number | null = null;

  constructor(private bookService: BookService,private modalService: NgbModal,public accountService : AccountService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getAllBooks();
    this.getBooks();
  }

  getAllBooks(){
    this.bookService.getBooks(this.bookParams).subscribe({
      next: (response: Book[]) => {
        this.allBooks = response
      },
      error: error => console.log(error)
    })
  }


  getBooks() {
    this.userId = this.getCurrentUserId();
  
    this.accountService.currentUser$
      .pipe(
        switchMap((user): Observable<Book[]> => {
          if (user) {
            this.userId = user.id;
            return this.bookService.getLentedBooks(this.userId);
          } else {
            // If user is not logged in, return an observable with an empty array
            return of([]);
          }
        })
      )
      .subscribe(
        (lentedBooks: Book[]) => {
          this.lentedBooks = lentedBooks || [];
  
          // Check if there are lented books before filtering
          if (this.lentedBooks.length > 0) {
            this.bookService.getBooks(this.bookParams).subscribe(
              (response: Book[]) => {
                this.books = response.filter(book => !this.lentedBooks.some(lentedBook => lentedBook.id === book.id));
              },
              error => {
                console.log(error);
              }
            );
          } else {
            // If there are no lented books, set all books as available
            this.bookService.getBooks(this.bookParams).subscribe(
              (response: Book[]) => {
                this.books = response;
              },
              error => {
                console.log(error);
              }
            );
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  
  borrowBook(book: Book){
    const updatedBook: BookCreate = {
      name: book.name,
      rating: book.rating,
      author: book.author,
      genre: book.genre,
      isBookAvailable: false,
      description: book.description,
      lentByUserId: book.lentByUserId,
      currentlyBorrowedByUserId: this.getCurrentUserId()
    };

    this.bookService.updateBook(book.id,updatedBook).subscribe(
      () => {
        this.toastr.success('Book Borrowed Successfully');
      },
      (error) => {
        console.error('Error adding book:', error);
      }
    );
    window.location.reload();
  }

  getCurrentUserId() {
    let currentUserId: number = -1; 
  
    this.accountService.currentUser$.subscribe((user) => {
      if (user) {
        currentUserId = user.id;
      }
    });
  
    return currentUserId;
  }

  onSearch(){
    this.bookParams.search = this.searchTerm?.nativeElement.value;
    this.getBooks();
  } 

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.bookParams = new BookParams();
    this.getBooks();
  }

  open(content: any,book: Book) {
    this.selectedBook = book; 
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getStarRating(rating: number | undefined): string {
    if (rating === undefined) {
      return ''; // or any default value you want to use for undefined rating
    }
  
    const fullStars = Math.floor(rating);
    const halfStars = Math.ceil(rating - fullStars);
    const emptyStars = 5 - fullStars - halfStars;
  
    return '★'.repeat(fullStars) + '☆'.repeat(halfStars) + '☆'.repeat(emptyStars);
  }
  
}
