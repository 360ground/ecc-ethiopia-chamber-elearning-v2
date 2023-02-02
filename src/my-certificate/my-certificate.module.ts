import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCertificateListComponent } from './my-certificate-list/my-certificate-list.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/service/AuthGuard';
import { SharedModule } from 'src/shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from 'src/service/interceptor.service';

const routes: Routes = [
  {
    path: '',
    component: MyCertificateListComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [MyCertificateListComponent],
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
export class MyCertificateModule { }
