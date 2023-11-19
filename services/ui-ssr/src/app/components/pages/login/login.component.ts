import {afterRender, Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {CookiesNoticeService} from '../../../services/cookies-notice/cookies-notice.service';
import {SyncService} from '../../../services/sync/sync.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
      syncService: SyncService,
      cookiesNoticeService: CookiesNoticeService,
      private authService: AuthService,
      private route: ActivatedRoute,
      private snackBar: MatSnackBar,
  ) {
    afterRender(() => {
      syncService.sync();
      cookiesNoticeService.triggerIfNotAccepted();
    });
  }

  ngOnInit() {
    this.route.queryParams
        .subscribe((queryParams) => {
          if (queryParams['next']) {
            this.snackBar.open('You must be logged in to view that resource');
          }
        });
  }

  doLogin() {
    this.authService.doLogin(this.username, this.password);
  }

  doGoogleLogin() {
    this.authService.doGoogleLogin();
  }
}
