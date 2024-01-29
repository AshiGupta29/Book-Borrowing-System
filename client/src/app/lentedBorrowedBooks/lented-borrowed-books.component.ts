import { Component } from '@angular/core';
import { Book } from '../shared/models/book';
import { BookService } from '../core/services/book.service';
import { BookParams } from '../shared/models/bookParams';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { AccountService } from '../core/services/account.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookCreate } from '../shared/models/bookCreate';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lented-borrowed-books',
  templateUrl: './lented-borrowed-books.component.html',
  styleUrls: ['./lented-borrowed-books.component.scss']
})
export class LentedBorrowedBooksComponent {
  lentedBooks: Book[] =[];
  borrowedBooks: Book[] =[];
  bookParams = new BookParams();
  userId : number | null = null;
  selectedBook: Book | null = null;
  closeResult = '';

  constructor(private bookService: BookService,private accountService: AccountService,private modalService: NgbModal,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getLentedBook();
    this.getBorrowedBook();
  }

  getLentedBook() {
    this.userId = this.getCurrentUserId();
    
    this.bookService.getLentedBooks(this.userId).subscribe((books: Book[]) => {
      // Now 'books' is directly of type 'Book[]'
      this.lentedBooks = books || [];
    }, error => {
      console.log(error);
    });
  }

  getBorrowedBook() {
    this.userId = this.getCurrentUserId();
    
    this.bookService.getBorrowedBooks(this.userId).subscribe((books: Book[]) => {
      // Now 'books' is directly of type 'Book[]'
      this.borrowedBooks = books || [];
    }, error => {
      console.log(error);
    });
  }
  
  returnBook(book: Book){
    const updatedBook: BookCreate = {
      name: book.name,
      rating: book.rating,
      author: book.author,
      genre: book.genre,
      isBookAvailable: true,
      description: book.description,
      lentByUserId: book.lentByUserId,
      currentlyBorrowedByUserId: null
    };

    this.bookService.updateBook(book.id,updatedBook).subscribe(
      () => {
        this.toastr.success('Book Returned Successfully');
        window.location.reload();
      },
      (error) => {
        console.error('Error adding book:', error);
      }
    );
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
      return '';
    }
  
    const fullStars = Math.floor(rating);
    const halfStars = Math.ceil(rating - fullStars);
    const emptyStars = 5 - fullStars - halfStars;
  
    return '★'.repeat(fullStars) + '☆'.repeat(halfStars) + '☆'.repeat(emptyStars);
  }
  

}
