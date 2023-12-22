import {inject} from '@angular/core';
import {CanActivateFn, Router, UrlSegment} from '@angular/router';

import {RoutePath} from '../app.routes';
import {AuthService} from '../services/auth/auth.service';
import {ServerClientSyncService} from '../services/server-client-sync/server-client-sync.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (route, state) => {
  if (inject(ServerClientSyncService).isServerSide()) {
    return false;
  }
  if (!inject(AuthService).isAuthenticated()) {
    inject(Router).navigate([`/${RoutePath.LOGIN}`], {queryParams: {
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
