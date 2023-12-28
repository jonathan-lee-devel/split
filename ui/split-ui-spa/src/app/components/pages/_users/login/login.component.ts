import {CommonModule, NgOptimizedImage} from '@angular/common';
import {afterRender, Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Params, RouterLink} from '@angular/router';

import {environment} from '../../../../../environments/environment';
import {AuthService} from '../../../../services/auth/auth.service';
import {CookiesNoticeService} from '../../../../services/cookies-notice/cookies-notice.service';
import {LoadingService} from '../../../../services/loading/loading.service';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoadingMap_ = this.loadingService.isLoadingMap_;
  protected readonly isJwtLoginLoadingKey = 'is-jwt-login-loading-key';

  constructor(
      cookiesNoticeService: CookiesNoticeService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    afterRender(() => {
      cookiesNoticeService.triggerIfNotAccepted();
    });
  }

  ngOnInit() {
    this.route.queryParams
        .subscribe((queryParams: Params) => {
          if (queryParams['next']) {
            this.snackBar.open('You must be logged in to view that resource');
            this.authService.setNext(queryParams['next']);
          }
        });
  }

  doLogin() {
    this.loadingService.onLoadingStart(this.isJwtLoginLoadingKey);
    setTimeout(() => {
      this.authService.doLogin({email: this.email, password: this.password})
          .then((successFlag) => {
            if (successFlag) {
              this.loadingService.onLoadingFinished(this.isJwtLoginLoadingKey);
            }
          });
    }, environment.SIMULATED_LOADING_DELAY_MS);
  }

  doGoogleLogin() {
    this.authService.doGoogleLogin();
  }
}
