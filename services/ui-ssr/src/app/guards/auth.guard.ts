import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";
import {RoutePaths} from "../app.routes";
import {ModalService} from "../services/modal/modal.service";
import {SyncService} from "../services/sync/sync.service";

export const authGuard: CanActivateFn = (route, state) => {
  if (inject(SyncService).isServerSide()) {
    return false;
  }
  if (!inject(AuthService).isAuthenticated()) {
    inject(Router).navigate([`/${RoutePaths.LOGIN}`]).catch((reason) => window.alert(reason));
    inject(ModalService).showDefaultModal('Login Required', 'You must be logged in to view that page');
    return false;
  }
  return true;
};
