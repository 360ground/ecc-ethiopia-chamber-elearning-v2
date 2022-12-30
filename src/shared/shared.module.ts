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

import { MatTabsModule } from '@angular/material/tabs';
import { TimeStampPipe } from 'src/app/timestamp.pipe';
import { GridComponents } from './grid/grid.component';

import { ColumnChooserService, ExcelExportService, GridModule, PdfExportService, ResizeService, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { ConfirmDialogueComponent } from './confirm-dialogue/confirm-dialogue.component';
import { ConfirmationService } from './confirmation.service';

import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

@NgModule({
  declarations: [HtmlSanitaizerPipe, TimeStampPipe, GridComponents, ConfirmDialogueComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTabsModule,
    NgbModule,
    GridModule,
    CheckBoxModule,
    DropDownListModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTabsModule,
    HtmlSanitaizerPipe,
    TimeStampPipe,
    NgbModule,
    GridModule,
    GridComponents,
    ConfirmDialogueComponent,
    CheckBoxModule,
    DropDownListModule
  ],
  providers: [AuthGuard,
    PageService,
    SortService,
    FilterService,
    GroupService,
    SearchService, 
    ToolbarService,
    ResizeService,
    ExcelExportService,
    PdfExportService,
    ColumnChooserService,
    ConfirmationService
  ],
})
export class SharedModule {}
