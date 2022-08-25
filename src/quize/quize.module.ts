import { NgModule } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/service/AuthGuard';
import { SharedModule } from 'src/shared/shared.module';
import { QuizeComponent } from './quize.component';
import {MatRadioModule} from '@angular/material/radio';


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
    MatRadioModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class QuizeModule { }
