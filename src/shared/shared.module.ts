import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlSanitaizerPipe } from 'src/app/html-sanitaizer.pipe';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from 'src/service/AuthGuard';
import {
  NgbAlert,
  NgbAlertConfig,
  NgbDropdown,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [HtmlSanitaizerPipe],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    NgbModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    HtmlSanitaizerPipe,
    NgbModule,
  ],
  providers: [AuthGuard],
})
export class SharedModule {}
