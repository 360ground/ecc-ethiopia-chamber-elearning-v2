import { NgModule } from '@angular/core';
import { CoursesComponent } from './courses.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { PhotoSlideComponent } from 'src/app/photo-slide/photo-slide.component';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
  },
];

@NgModule({
    declarations: [CoursesComponent,PhotoSlideComponent],
    exports: [RouterModule],
    providers: [NgbModal, NgbActiveModal, NgbModalConfig],
    imports: [
        SharedModule,
        CommonModule,
        MatIconModule,
        MatSidenavModule,
        RouterModule.forChild(routes),
    ]
})
export class CoursesModule {}