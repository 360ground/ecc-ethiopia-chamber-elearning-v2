import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Routes, RouterModule } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/shared/shared.module';
import { MyRequestComponent } from './my-request/my-request.component';
import { EnrollmentRequestFormComponent } from './RequestForm/enrollment-request-form.component';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

const routes: Routes = [
  {
    path: 'myrequest',
    component: MyRequestComponent,
  },
  {
    path: 'create',
    component: EnrollmentRequestFormComponent,
  },
  {
    path: 'edit/:id',
    component: EnrollmentRequestFormComponent,
  }
];

@NgModule({
    declarations: [EnrollmentRequestFormComponent, MyRequestComponent],
    exports: [RouterModule],
    providers: [NgbModal, NgbActiveModal, NgbModalConfig],
    imports: [
        SharedModule,
        CommonModule,
        MatIconModule,
        DateRangePickerModule,
        DropDownListModule,
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class EnrollmentRequestModule { }