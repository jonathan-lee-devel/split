import {CommonModule, NgOptimizedImage} from '@angular/common';
import {afterRender, Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Params, RouterLink} from '@angular/router';

import {AuthService} from '../../../../services/auth/auth.service';
import {CookiesNoticeService} from '../../../../services/cookies-notice/cookies-notice.service';

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
      cookiesNoticeService: CookiesNoticeService,
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
    this.authService.doLogin({email: this.email, password: this.password});
  }

  doGoogleLogin() {
    this.authService.doGoogleLogin();
  }
}
