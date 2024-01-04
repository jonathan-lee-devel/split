import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {DEFAULT_APP_PROVIDERS} from './default-app-providers';
import {StoreModule} from '@ngrx/store';
import {counterReducer} from './+state/counter.reducer';


export const appConfig: ApplicationConfig = {
  providers: [
    ...DEFAULT_APP_PROVIDERS,
    importProvidersFrom(
      StoreModule.forRoot({
        count: counterReducer,
      })),
  ],
};
