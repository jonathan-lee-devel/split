import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideEffects} from '@ngrx/effects';
import {provideState, provideStore} from '@ngrx/store';
import {provideStoreDevtools} from '@ngrx/store-devtools';

import {counterReducer} from './+state/counter/counter.reducer';
import {COUNT_FEATURE_NAME} from './+state/counter/counter.selector';
import {PropertyEffects} from './components/pages/_properties/+state/property.effect';
import {propertyReducer} from './components/pages/_properties/+state/property.reducer';
import {PROPERTY_FEATURE_NAME} from './components/pages/_properties/+state/property.selector';
import {ExpenseEffects} from './components/pages/_properties/_expenses/+state/expense.effect';
import {expenseReducer} from './components/pages/_properties/_expenses/+state/expense.reducer';
import {EXPENSE_FEATURE_NAME} from './components/pages/_properties/_expenses/+state/expense.selector';
import {DEFAULT_APP_PROVIDERS} from './default-app-providers';


export const appConfig: ApplicationConfig = {
  providers: [
    ...DEFAULT_APP_PROVIDERS,
    provideStore(),
    provideState({name: COUNT_FEATURE_NAME, reducer: counterReducer}),
    provideState({name: PROPERTY_FEATURE_NAME, reducer: propertyReducer}),
    provideState({name: EXPENSE_FEATURE_NAME, reducer: expenseReducer}),
    provideEffects([PropertyEffects, ExpenseEffects]),
    provideStoreDevtools({maxAge: 25, logOnly: !isDevMode()}),
  ],
};
