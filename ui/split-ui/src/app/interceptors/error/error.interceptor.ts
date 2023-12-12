import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {catchError, Observable} from 'rxjs';

import {RoutePaths} from '../../app.routes';
import {HttpStatus} from '../../common/enums/HttpStatus';
import {LoadingService} from '../../services/loading/loading.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({withCredentials: true});

    return next.handle(request)
        .pipe(catchError((err) => this.handleError(err)));
  }

  private handleError(error: HttpErrorResponse): Observable<HttpEvent<unknown>> {
    this.loadingService.onAllLoadingFinished();
    if (error.status === 0) {
      throw error;
    }

    if (error.status === HttpStatus.BAD_REQUEST) {
      if (error.error.status) {
        let message: string;
        switch (error.error.status) {
          case 'INVALID_TOKEN':
            message = 'An invalid token has been provided';
            break;
          case 'EMAIL_VERIFICATION_EXPIRED':
            message = 'E-mail verification has expired, you will need to resubmit your request';
            break;
          case 'EMAIL_ALREADY_VERIFIED':
            message = 'E-mail verification has already been completed successfully, you may now login';
            break;
          default:
            message = 'An unknown error has occurred';
        }
        this.snackBar.open(message);
      } else {
        if (error.error.errors && error.error.errors[0].msg) {
          this.snackBar.open(JSON.stringify(error.error.errors[0].msg));
        } else if (error.error.error) {
          this.snackBar.open('Request Error', JSON.stringify(error.error.error));
        } else if (error.error.issues && error.error.issues.length >= 1) {
          this.snackBar.open('Request Error', `${error.error.issues[0].path[0]}: ${JSON.stringify(error.error.issues[0].message)}`);
        } else {
          console.log(JSON.stringify(error.error));
          this.snackBar.open('Request Error', 'An unknown request error has occurred');
        }
      }
    }

    if (error.status === HttpStatus.UNAUTHORIZED) {
      this.snackBar.open( 'Invalid Login Credentials');
      this.ngZoneRedirect(`/${RoutePaths.LOGIN}`);
    }

    if (error.status === HttpStatus.FORBIDDEN) {
      this.snackBar.open('Access to that resource or action is denied');
    }

    if (error.status === HttpStatus.NOT_FOUND) {
      this.ngZoneRedirect(`/${RoutePaths.ERROR_NOT_FOUND}`);
    }

    if (error.status === HttpStatus.CONFLICT) {
      this.snackBar.open('That entity already exists, cannot perform request');
    }

    if (error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.ngZoneRedirect(`/${RoutePaths.SERVER_ERROR}`);
    }

    throw error;
  }

  private ngZoneRedirect(path: string) {
    this.ngZone.run(() => {
      this.router.navigate([path]).catch((reason) => window.alert(reason));
    });
  }
}
