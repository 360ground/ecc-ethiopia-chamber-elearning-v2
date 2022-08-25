import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyEducationComponent } from './my-education/my-education.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AuthGuard } from 'src/service/AuthGuard';

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
})
export class MyEducationModule {}
