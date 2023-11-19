import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {RegisterDto} from '../../dtos/register/RegisterDto';
import {environment} from '../../../environments/environment';
import {RoutePaths} from '../../app.routes';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  doRegister(email: string,
      firstName: string,
      lastName: string,
      password: string,
      confirmPassword: string,
      acceptTermsAndConditions: boolean) {
    this.httpClient.post<RegisterDto>(`${environment.RAW_API_URL}/register`, {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      acceptTermsAndConditions,
    }).subscribe((registerDto) => {
      this.router.navigate([`/${RoutePaths.LOGIN}`]).catch((reason) => {
        window.alert(reason);
      });
      let message: string;
      switch (registerDto.status) {
        case 'AWAITING_EMAIL_VERIFICATION':
          message = 'Please check your e-mail inbox for further instructions';
          break;
        default:
          message = 'An unknown error has occurred';
      }
      this.snackBar.open(message);
    });
  }

  doConfirmRegister(tokenValue: string) {
    this.httpClient.post<RegisterDto>(`${environment.RAW_API_URL}/register/confirm`, {tokenValue})
        .subscribe((registerDto) => {
          let message: string;
          let shouldRedirect = false;
          switch (registerDto.status) {
            case 'SUCCESS':
              message = 'Your e-mail has been verified successfully, you may now log in';
              shouldRedirect = true;
              break;
            default:
              message = 'An unknown error has occurred';
          }
          this.snackBar.open(message);
          if (shouldRedirect) {
            this.router.navigate([`/${RoutePaths.LOGIN}`]).catch((reason) => window.alert(reason));
          }
        });
  }
}
