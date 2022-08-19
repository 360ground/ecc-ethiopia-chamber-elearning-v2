import { NgModule } from '@angular/core';
import { StartLearningComponent } from './start-learning.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AuthGuard } from 'src/service/AuthGuard';
import { ModulesComponent } from './modules/modules.component';
import { ProgressBarModule } from '@syncfusion/ej2-angular-progressbar';
import { NgCircleProgressModule } from 'ng-circle-progress';

const routes: Routes = [
  {
    path: '',
    component: StartLearningComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'modules',
    component: ModulesComponent,
    // canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [StartLearningComponent, ModulesComponent],
  imports: [
    SharedModule,
    NgCircleProgressModule.forRoot({
      radius: 60,
      space: -10,
      outerStrokeGradient: true,
      outerStrokeWidth: 10,
      outerStrokeColor: '#4882c2',
      outerStrokeGradientStopColor: '#78C000',
      innerStrokeColor: '#e7e8ea',
      innerStrokeWidth: 10,
      animateTitle: false,
      animationDuration: 1000,
      showUnits: false,
      showBackground: false,
      clockwise: false,
      startFromZero: false,
      lazy: true,
    }),

    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
})
export class StartLearningModule {}
