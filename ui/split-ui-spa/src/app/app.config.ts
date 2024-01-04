import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {StoreModule} from '@ngrx/store';

import {counterReducer} from './+state';
import {DEFAULT_APP_PROVIDERS} from './default-app-providers';


export const appConfig: ApplicationConfig = {
  providers: [
    ...DEFAULT_APP_PROVIDERS,
    importProvidersFrom(
        StoreModule.forRoot({
          count: counterReducer,
        })),
  ],
};
