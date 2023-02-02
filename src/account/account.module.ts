import { NgModule } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/shared/shared.module';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

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
    path: 'forget',
    component: ForgetPasswordComponent,
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgetPasswordComponent,
   ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [NgbAlertConfig],
  exports: [RouterModule],
})
export class AccountModule {}