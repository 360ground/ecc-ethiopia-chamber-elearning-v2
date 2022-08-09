import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { SharedModule } from 'src/shared/shared.module';
import { ApiService } from 'src/service/api.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
