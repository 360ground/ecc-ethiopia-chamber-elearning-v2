import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/account/login/login.component';
import { CourseDetailComponent } from 'src/course-detail/course-detail.component';
import { CoursesComponent } from 'src/courses/courses.component';
import { MyCourseComponent } from 'src/my-course/my-course.component';
import { ApiService } from 'src/service/api.service';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/courses',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('../account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('../account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('../account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('../courses/courses.module').then(m => m.CoursesModule)
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('../course-detail/course-detail.module').then(m => m.CourseDetailModule)
  },
  {
    path: 'mycourse',
    loadChildren: () => import('../my-course/my-courses.module').then(m => m.MyCoursesModule)
  },
  {
    path: 'quize',
    loadChildren: () => import('../quize/quize.module').then(m => m.QuizeModule)
  },
  {
    path: 'learning',
    loadChildren: () => import('../start-learning/start-learning.module').then(m => m.StartLearningModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ApiService]
})
export class AppRoutingModule { }
