import {afterRender, Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {CookiesNoticeService} from "../../../services/cookies-notice/cookies-notice.service";
import {SyncService} from "../../../services/sync/sync.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(
      syncService: SyncService,
      cookiesNoticeService: CookiesNoticeService,
      private authService: AuthService,
  ) {
    afterRender(() => {
      syncService.sync();
      cookiesNoticeService.triggerIfNotAccepted();
    })
  }

  doLogin() {
    this.authService.doLogin(this.username, this.password);
  }

  doGoogleLogin() {
    this.authService.doGoogleLogin();
  }
}
