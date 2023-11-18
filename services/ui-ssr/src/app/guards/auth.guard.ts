import {CanActivateFn, Router, UrlSegment} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {RoutePaths} from '../app.routes';
import {SyncService} from '../services/sync/sync.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (route, state) => {
  if (inject(SyncService).isServerSide()) {
    return false;
  }
  if (!inject(AuthService).isAuthenticated()) {
    inject(Router).navigate([`/${RoutePaths.LOGIN}`], {queryParams: {
      next: buildUrlEncodedNextParam(route.url),
    }}).catch((reason) => window.alert(reason));
    return false;
  }
  return true;
};

const buildUrlEncodedNextParam = (urlSegments: UrlSegment[]) => {
  let nextParam = '';
  for (const urlSegment of urlSegments) {
    nextParam = `${nextParam}/${urlSegment}`;
  }
  return encodeURIComponent(nextParam);
};
