import { NgModule } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/shared/shared.module';
import { AuthGuard } from 'src/service/AuthGuard';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'profile',
    component: UpdateProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'forget',
    component: ForgetPasswordComponent,
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    UpdateProfileComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [NgbAlertConfig],
  exports: [RouterModule],
})
export class AccountModule {}
