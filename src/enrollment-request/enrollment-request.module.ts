import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Routes, RouterModule } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/shared/shared.module';
import { EnrollmentRequestComponent } from 'src/enrollmentRequest/enrollment-request.component';
import { MyRequestComponent } from './my-request/my-request.component';
import { RequestsComponent } from './requests/requests.component';



const routes: Routes = [
  {
    path: '',
    component: MyRequestComponent,
  },
  {
    path: 'create',
    component: EnrollmentRequestComponent,
  },
  {
    path: 'requests',
    component: RequestsComponent,
  },
];

@NgModule({
  declarations: [EnrollmentRequestComponent, MyRequestComponent, RequestsComponent],
  imports: [
    SharedModule,
    CommonModule,
    MatIconModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [NgbModal, NgbActiveModal, NgbModalConfig],
})
export class EnrollmentRequestModule { }
