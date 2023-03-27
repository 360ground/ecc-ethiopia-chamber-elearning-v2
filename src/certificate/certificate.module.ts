import { NgModule } from '@angular/core';
import { MyCertificateListComponent } from './my-certificate-list/my-certificate-list.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/service/AuthGuard';
import { SharedModule } from 'src/shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from 'src/service/interceptor.service';
import { VerifayCertificateComponent } from './verifay-certificate/verifay-certificate.component';

const routes: Routes = [
  {
    path: 'mylist',
    component: MyCertificateListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'verification',
    component: VerifayCertificateComponent,
  },
];

@NgModule({
  declarations: [MyCertificateListComponent, VerifayCertificateComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ]
})
export class CertificateModule { }
