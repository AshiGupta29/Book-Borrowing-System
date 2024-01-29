import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBooksComponent } from './add-books.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddBooksComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AddBooksModule { }
