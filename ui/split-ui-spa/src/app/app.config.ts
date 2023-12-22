import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {ApplicationConfig} from '@angular/core';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {AuthInterceptor} from './interceptors/auth/auth.interceptor';
import {ErrorInterceptor} from './interceptors/error/error.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    provideAnimations(),
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    provideAnimations(),
  ],
};
