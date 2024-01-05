import {ApplicationConfig} from '@angular/core';
import {provideState, provideStore} from '@ngrx/store';

import {counterReducer} from './+state/counter/counter.reducer';
import {COUNT_FEATURE_NAME} from './+state/counter/counter.selector';
import {DEFAULT_APP_PROVIDERS} from './default-app-providers';


export const appConfig: ApplicationConfig = {
  providers: [
    ...DEFAULT_APP_PROVIDERS,
    provideStore(),
    provideState({name: COUNT_FEATURE_NAME, reducer: counterReducer}),
  ],
};
