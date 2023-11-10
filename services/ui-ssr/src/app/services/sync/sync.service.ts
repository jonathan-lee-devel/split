import { Injectable } from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(private authService: AuthService) { }

  sync() {
    this.authService.triggerOnServerReload();
  }
}
