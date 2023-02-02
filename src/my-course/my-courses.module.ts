import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCourseComponent } from './my-course.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AuthGuard } from 'src/service/AuthGuard';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatIconModule } from '@angular/material/icon';
import { Overlay } from '@angular/cdk/overlay';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from 'src/service/interceptor.service';

const routes: Routes = [
  {
    path: '',
    component: MyCourseComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [MyCourseComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatIconModule,
    NgCircleProgressModule.forRoot({
      radius: 10,
      space: -7,
      outerStrokeGradient: true,
      outerStrokeWidth: 8,
      outerStrokeColor: '#4882c2',
      outerStrokeGradientStopColor: '#78C000',
      innerStrokeColor: '#e7e8ea',
      innerStrokeWidth: 8,
      animateTitle: false,
      animationDuration: 1000,
      showUnits: false,
      showBackground: false,
      clockwise: false,
      startFromZero: false,
      lazy: true,
      titleFontSize: '10',
    }),
  ],
  exports: [RouterModule],
  providers: [MatSnackBar, Overlay,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
})
export class MyCoursesModule {}
