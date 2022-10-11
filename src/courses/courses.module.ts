import { NgModule } from '@angular/core';
import { CoursesComponent } from './courses.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AuthGuard } from 'src/service/AuthGuard';
import { MatIconModule } from '@angular/material/icon';

import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
  },
];

@NgModule({
  declarations: [CoursesComponent],
  imports: [
    SharedModule,
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [NgbModal, NgbActiveModal, NgbModalConfig],
})
export class CoursesModule {}
