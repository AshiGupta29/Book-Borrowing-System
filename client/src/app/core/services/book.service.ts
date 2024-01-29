import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from 'src/app/shared/models/book';
import { BookCreate } from 'src/app/shared/models/bookCreate';
import { BookParams } from 'src/app/shared/models/bookParams';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  baseUrl = 'http://localhost:5002/api/'
  constructor(private http: HttpClient) { }

  getBooks(bookParams: BookParams) {
    let params = new HttpParams();

    if(bookParams.search) params = params.append('search', bookParams.search);

    return this.http.get<Book[]>(this.baseUrl + 'books', {params});
  }

  getBook(id: number){
    return this.http.get<Book>(this.baseUrl + 'books/' + id);
  }

  addBook(bookCreate: BookCreate) {
    return this.http.post<BookCreate>(this.baseUrl + 'books', bookCreate);
  }

  updateBook(id: number,bookUpdate: BookCreate){
    return this.http.put<BookCreate>(this.baseUrl + 'books/' + id, bookUpdate);
  }

  getLentedBooks(userId: number){
    return this.http.get<Book[]>(this.baseUrl + 'books/myLentedBooks/' + userId);
  }

  getBorrowedBooks(userId: number){
    return this.http.get<Book[]>(this.baseUrl + 'books/MyBorrowedBooks/' + userId);
  }
}
