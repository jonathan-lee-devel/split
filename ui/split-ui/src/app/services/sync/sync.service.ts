import {isPlatformServer} from '@angular/common';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';

import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  constructor(
        @Inject(PLATFORM_ID) private platformId: NonNullable<unknown>,
        private authService: AuthService,
  ) {}

  isServerSide() {
    return isPlatformServer(this.platformId);
  }

  isClientSide() {
    return !this.isServerSide();
  }

  sync() {
    this.authService.triggerOnServerReload();
  }
}
