import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookCreate } from '../shared/models/bookCreate';
import { BookService } from '../core/services/book.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../core/services/account.service';

@Component({
  selector: 'app-add-books',
  templateUrl: './add-books.component.html',
  styleUrls: ['./add-books.component.scss']
})
export class AddBooksComponent implements OnInit {
  addBook!: FormGroup;

  constructor(private fb: FormBuilder, private bookService : BookService, private toastr: ToastrService,private accountService: AccountService){}

  ngOnInit() {
    this.addBook = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      rating: ['', [Validators.required, Validators.pattern(/^(?:[0-4](\.[0-9])?|5)$/)]],
      author: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      genre: ['', [Validators.required,Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      description: ['', [Validators.required,Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9.\s]*$/)]],
    })
  }

  resetForm() {
    this.addBook.reset(); // Reset the form to its initial state
  }

  onSubmit(addBookForm: FormGroup) {
    if (addBookForm.valid) {
      // Create the book object with the form inputs
      const book: BookCreate = {
        name: addBookForm.value.name,
        rating: addBookForm.value.rating,
        author: addBookForm.value.author,
        genre: addBookForm.value.genre,
        isBookAvailable: true,
        description: addBookForm.value.description,
        lentByUserId: this.getCurrentUserId(),
        currentlyBorrowedByUserId: null
      };

      // Call the service method to add the book
      this.bookService.addBook(book).subscribe(
        () => {
          this.toastr.success('Book added Successfully');
          // Refresh the page or perform any other necessary actions
          addBookForm.reset();
        },
        (error) => {
          console.error('Error adding book:', error);
        }
      );
    }
  }

  getCurrentUserId() {
    let currentUserId: number | null = null;

    this.accountService.currentUser$.subscribe((user) => {
      if (user) {
        currentUserId = user.id;
      }
    });

    return currentUserId;
  }
}
