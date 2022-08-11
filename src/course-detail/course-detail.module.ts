import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseDetailComponent } from './course-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AuthGuard } from 'src/service/AuthGuard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';

const routes: Routes = [
  {
    path: '',
    component: CourseDetailComponent,
  },
];

@NgModule({
  declarations: [CourseDetailComponent],
  imports: [SharedModule, NgbModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MatSnackBar, Overlay],
})
export class CourseDetailModule {}
