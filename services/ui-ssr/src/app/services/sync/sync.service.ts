import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {isPlatformServer} from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class SyncService {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private authService: AuthService,
    ) {}

    isServerSide() {
        return isPlatformServer(this.platformId)
    }

    sync() {
        this.authService.triggerOnServerReload();
    }
}
