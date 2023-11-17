import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {isPlatformServer} from '@angular/common';
import {ModalService} from '../modal/modal.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  constructor(
        @Inject(PLATFORM_ID) private platformId: NonNullable<unknown>,
        private authService: AuthService,
        private modalService: ModalService,
  ) {}

  isServerSide() {
    return isPlatformServer(this.platformId);
  }

  sync() {
    this.authService.triggerOnServerReload();
  }
}
