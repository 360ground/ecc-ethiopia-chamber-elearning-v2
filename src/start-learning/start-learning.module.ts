import { NgModule } from '@angular/core';
import { StartLearningComponent } from './start-learning.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AuthGuard } from 'src/service/AuthGuard';
import { ModulesComponent } from './modules/modules.component';

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
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartLearningModule {}
