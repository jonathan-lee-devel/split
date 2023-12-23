import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {rebaseRoutePath, RoutePath} from '../../app.routes';
import {PasswordResetDto} from '../../dtos/password/PasswordResetDto';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  constructor(
      private httpClient: HttpClient,
      private router: Router,
      private snackBar: MatSnackBar,
  ) { }

  public sendPasswordResetRequest(email: string): void {
    this.httpClient.post<PasswordResetDto>(`${environment.USERS_SERVICE_BASE_URL}/password/reset`, {email})
        .subscribe((passwordResetDto) => {
          let message: string;
          let shouldRedirect = false;
          switch (passwordResetDto.status) {
            case 'AWAITING_EMAIL_VERIFICATION':
              message = 'Please check your e-mail inbox for further instructions';
              shouldRedirect = true;
              break;
            default:
              message = 'An unknown error has occurred';
          }
          this.snackBar.open(message);
          if (shouldRedirect) {
            this.router.navigate([rebaseRoutePath(RoutePath.LOGIN)]).catch((reason) => window.alert(reason));
          }
        });
  }

  confirmPasswordReset(tokenValue: string, password: string, confirmPassword: string) {
    this.httpClient.post<PasswordResetDto>(`${environment.USERS_SERVICE_BASE_URL}/password/reset/confirm`, {
      tokenValue,
      password,
      confirmPassword,
    })
        .subscribe((passwordResetDto) => {
          let message: string;
          let shouldRedirect = false;
          switch (passwordResetDto.status) {
            case 'SUCCESS':
              message = 'Password has been reset successfully, you may now log in';
              shouldRedirect = true;
              break;
            default:
              message = 'An unknown error has occurred';
          }
          if (shouldRedirect) {
            this.router.navigate([`/${RoutePath.LOGIN}`]).catch((reason) => window.alert(reason));
          }
          this.snackBar.open(message);
        });
  }
}
