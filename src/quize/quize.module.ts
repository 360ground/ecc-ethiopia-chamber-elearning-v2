import { NgModule } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/service/AuthGuard';
import { SharedModule } from 'src/shared/shared.module';
import { StartQuizeComponent } from './startquize.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { QuizesComponent } from './quizes/quizes.component';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path: '',
    component: QuizesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'start',
    component: StartQuizeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [StartQuizeComponent, QuizesComponent],
  imports: [
    SharedModule,
    MatExpansionModule,
    MatIconModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class QuizeModule {}
