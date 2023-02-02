import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'src/service/AuthGuard';
import { InterceptorService } from 'src/service/interceptor.service';
import { SharedModule } from 'src/shared/shared.module';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { NewPasswordComponent } from '../new-password/new-password.component';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'setnewpassword',
    component: NewPasswordComponent,
  },
];

@NgModule({
  declarations: [
    UpdateProfileComponent,
    ChangePasswordComponent,
    NewPasswordComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [NgbAlertConfig,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
  exports: [RouterModule],
})
export class ProfileModule { }