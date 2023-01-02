import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiService } from 'src/service/api.service';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/courses',
    pathMatch: 'full',
  },
  {
    path: 'account',
    loadChildren: () =>
      import('../account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('../courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'courseDetail',
    loadChildren: () =>
      import('../course-detail/course-detail.module').then(
        (m) => m.CourseDetailModule
      ),
  },
  {
    path: 'mycourse',
    loadChildren: () =>
      import('../my-course/my-courses.module').then((m) => m.MyCoursesModule),
  },
  {
    path: 'myeducation',
    loadChildren: () =>
      import('../my-education/my-education.module').then(
        (m) => m.MyEducationModule
      ),
  },
  {
    path: 'mycertificate',
    loadChildren: () =>
      import('../my-certificate/my-certificate.module').then(
        (m) => m.MyCertificateModule
      ),
  },
  {
    path: 'quizes',
    loadChildren: () =>
      import('../quize/quize.module').then((m) => m.QuizeModule),
  },
  {
    path: 'learning',
    loadChildren: () =>
      import('../start-learning/start-learning.module').then(
        (m) => m.StartLearningModule
      ),
  },
  {
    path: 'enrollment',
    loadChildren: () =>
      import('../enrollment-request/enrollment-request.module').then(
        (m) => m.EnrollmentRequestModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('../admin/admin.module').then(
        (m) => m.AdminModule
      ),
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ApiService],
})
export class AppRoutingModule {}
