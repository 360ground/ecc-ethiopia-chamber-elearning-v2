import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCourseComponent } from './my-course.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AuthGuard } from 'src/service/AuthGuard';

const routes: Routes = [
  {
    path: '',
    component: MyCourseComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    MyCourseComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class MyCoursesModule { }