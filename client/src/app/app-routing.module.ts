import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { AddBooksComponent } from './addBooks/add-books.component';
import { LentedBorrowedBooksComponent } from './lentedBorrowedBooks/lented-borrowed-books.component';
import { AuthGuard } from './core/guards/Auth.guard';

const routes: Routes = [
  {path:'',component: BookComponent, data: {breadcrumb: 'Home'}},
  {path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  {path: 'addBooks', component: AddBooksComponent, canActivate: [AuthGuard]},
  {path: 'lentedBorrowedBooksComponent', component: LentedBorrowedBooksComponent, canActivate: [AuthGuard]},
  {path:'**',redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
