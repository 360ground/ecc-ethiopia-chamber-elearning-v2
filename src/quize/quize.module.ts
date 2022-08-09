import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/service/AuthGuard';
import { SharedModule } from 'src/shared/shared.module';
import { QuizeComponent } from './quize.component';

const routes: Routes = [
  {
    path: '',
    component: QuizeComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    QuizeComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class QuizeModule { }
