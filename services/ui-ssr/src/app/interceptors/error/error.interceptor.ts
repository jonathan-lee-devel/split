import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {ModalService} from "../../services/modal/modal.service";
import {HttpStatus} from "../../common/enums/HttpStatus";
import {Router} from "@angular/router";
import {RoutePaths} from "../../app.routes";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private modalService: ModalService,
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({withCredentials: true});

        return next.handle(request)
            .pipe(catchError((err) => this.handleError(err)));
    }

    private handleError(error: HttpErrorResponse): Observable<HttpEvent<unknown>> {
        // this.loadingService.onAllLoadingFinished();
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
                this.modalService.showDefaultModal('Request Error', message);
            } else {
                if (error.error.errors && error.error.errors[0].msg) {
                    this.modalService.showDefaultModal('Request Error', JSON.stringify(error.error.errors[0].msg));
                } else if (error.error.error) {
                    this.modalService.showDefaultModal('Request Error', JSON.stringify(error.error.error));
                } else if (error.error.issues && error.error.issues.length >= 1) {
                    this.modalService.showDefaultModal('Request Error', `${error.error.issues[0].path[0]}: ${JSON.stringify(error.error.issues[0].message)}`);
                } else {
                    console.log(JSON.stringify(error.error));
                    this.modalService.showDefaultModal('Request Error', 'An unknown request error has occurred');
                }
            }
        }

        if (error.status === HttpStatus.UNAUTHORIZED) {
            this.modalService.showDefaultModal('Authentication Error', 'Invalid Login Credentials');
            this.router.navigate([`/${RoutePaths.LOGIN}`]).catch((reason) => window.alert(reason));
        }

        if (error.status === HttpStatus.FORBIDDEN) {
            this.modalService.showDefaultModal('Authorization Error', 'Access to that resource or action is denied');
        }

        if (error.status === HttpStatus.NOT_FOUND) {
            this.router.navigate([`/${RoutePaths.ERROR_NOT_FOUND}`]).catch((reason) => window.alert(reason));
        }

        if (error.status === HttpStatus.CONFLICT) {
            this.modalService.showDefaultModal('Request Conflict', 'That entity already exists, cannot perform request');
        }

        if (error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.router.navigate([`/${RoutePaths.SERVER_ERROR}`]).catch((reason) => window.alert(reason));
        }

        throw error;
    }
}
