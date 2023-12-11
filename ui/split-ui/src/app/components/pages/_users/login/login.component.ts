import {afterRender, Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Params, RouterLink} from '@angular/router';
import {SyncService} from '../../../../services/sync/sync.service';
import {CookiesNoticeService} from '../../../../services/cookies-notice/cookies-notice.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgOptimizedImage,
    RouterLink,
    FormsModule,
    RouterLink,
    NgOptimizedImage,
    NgOptimizedImage,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email: string = '';
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
        .subscribe((queryParams: Params) => {
          if (queryParams['next']) {
            this.snackBar.open('You must be logged in to view that resource');
          }
        });
  }

  doLogin() {
    this.authService.doLogin({email: this.email, password: this.password});
  }

  doGoogleLogin() {
    this.authService.doGoogleLogin();
  }
}
