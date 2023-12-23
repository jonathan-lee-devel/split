import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {RoutePath} from '../../app.routes';
import {RegisterDto} from '../../dtos/register/RegisterDto';
import {RegistrationRequestDto} from '../../dtos/register/RegistrationRequestDto';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  doRegister(registrationRequestDto: RegistrationRequestDto) {
    this.httpClient.post<RegisterDto>(`${environment.USERS_SERVICE_BASE_URL}/register`, registrationRequestDto)
        .subscribe((registerDto) => {
          this.router.navigate([`/${RoutePath.LOGIN}`])
              .catch((reason) => {
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
    this.httpClient.post<RegisterDto>(`${environment.USERS_SERVICE_BASE_URL}/register/confirm`, {tokenValue})
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
          if (shouldRedirect) {
            this.router.navigate([`/${RoutePath.LOGIN}`]).catch((reason) => window.alert(reason));
          }
          this.snackBar.open(message);
        });
  }
}
