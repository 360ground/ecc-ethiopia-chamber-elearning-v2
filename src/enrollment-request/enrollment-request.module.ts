import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Routes, RouterModule } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/shared/shared.module';
import { MyRequestComponent } from './my-request/my-request.component';
import { RequestsComponent } from './requests/requests.component';
import { EnrollmentRequestFormComponent } from './RequestForm/enrollment-request-form.component';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ReportComponent } from './report/report.component';

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
    path: 'requests',
    component: RequestsComponent,
  },
];

@NgModule({
    declarations: [EnrollmentRequestFormComponent, MyRequestComponent, RequestsComponent, ReportComponent],
    exports: [RouterModule],
    providers: [NgbModal, NgbActiveModal, NgbModalConfig],
    imports: [
        SharedModule,
        CommonModule,
        MatIconModule,
        UploaderModule,
        DateRangePickerModule,
        DropDownListModule,
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class EnrollmentRequestModule { }
