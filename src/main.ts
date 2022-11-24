import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLicense } from '@syncfusion/ej2-base';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Registering Syncfusion license key
registerLicense('ORg4AjUWIQA/Gnt2VVhjQlFac1hJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0RhXX9cc31XQmBYUkA=');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
