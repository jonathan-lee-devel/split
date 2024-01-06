import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {isDevMode} from '@angular/core';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {provideEffects} from '@ngrx/effects';
import {provideState, provideStore} from '@ngrx/store';
import {provideStoreDevtools} from '@ngrx/store-devtools';

import {counterReducer} from './+state/counter/counter.reducer';
import {COUNT_FEATURE_NAME} from './+state/counter/counter.selector';
import {routes} from './app.routes';
import {PropertyEffects} from './components/pages/_properties/+state/property.effect';
import {propertyReducer} from './components/pages/_properties/+state/property.reducer';
import {PROPERTY_FEATURE_NAME} from './components/pages/_properties/+state/property.selector';
import {ExpenseEffects} from './components/pages/_properties/_expenses/+state/expense.effect';
import {expenseReducer} from './components/pages/_properties/_expenses/+state/expense.reducer';
import {EXPENSE_FEATURE_NAME} from './components/pages/_properties/_expenses/+state/expense.selector';
import {AuthInterceptor} from './interceptors/auth/auth.interceptor';
import {ErrorInterceptor} from './interceptors/error/error.interceptor';


export const DEFAULT_APP_PROVIDERS = [
  provideStore(),
  provideState({name: COUNT_FEATURE_NAME, reducer: counterReducer}),
  provideState({name: PROPERTY_FEATURE_NAME, reducer: propertyReducer}),
  provideState({name: EXPENSE_FEATURE_NAME, reducer: expenseReducer}),
  provideEffects([PropertyEffects, ExpenseEffects]),
  provideStoreDevtools({maxAge: 25, logOnly: !isDevMode()}),
  provideRouter(routes),
  provideHttpClient(withFetch(), withInterceptorsFromDi()),
  {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
  provideAnimations(),
];
