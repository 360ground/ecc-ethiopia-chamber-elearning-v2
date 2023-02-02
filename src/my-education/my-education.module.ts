import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyEducationComponent } from './my-education/my-education.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AuthGuard } from 'src/service/AuthGuard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from 'src/service/interceptor.service';

const routes: Routes = [
  {
    path: '',
    component: MyEducationComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [MyEducationComponent],
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
export class MyEducationModule {}
