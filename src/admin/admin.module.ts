import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouresExtraInfoComponent } from './coures-extra-info/coures-extra-info.component';
import { Routes, RouterModule } from '@angular/router';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ReportComponent } from 'src/enrollment-request/report/report.component';
import { RequestsComponent } from 'src/enrollment-request/requests/requests.component';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
  {
    path: 'financial-reports',
    component: ReportComponent,
  },
  {
    path: 'course-extra-info',
    component: CouresExtraInfoComponent,
  },
  {
    path: 'enrollment-requests',
    component: RequestsComponent,
  },
];

@NgModule({
  declarations: [RequestsComponent, ReportComponent, CouresExtraInfoComponent],
    exports: [RouterModule],
    providers: [],
    imports: [
        SharedModule,
        CommonModule,
        DateRangePickerModule,
        DropDownListModule,
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class AdminModule { }
