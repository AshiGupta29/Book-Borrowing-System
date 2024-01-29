import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from './text-input/text-input.component';

@NgModule({
  declarations: [
    TextInputComponent
  ],
  imports: [
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgbDropdownModule
  ],
  exports: [
    NgbPaginationModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    TextInputComponent
  ]
})
export class SharedModule { }
