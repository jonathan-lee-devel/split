import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {MatDialog} from '@angular/material/dialog';
import {
  CookiesNoticeDialogComponent,
} from '../../components/lib/dialogs/cookies-notice-dialog/cookies-notice-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class CookiesNoticeService {
  static COOKIE_NOTICE_ACCEPTED_KEY: string = 'Cookies-Notice';
  static COOKIE_NOTICE_IS_ACCEPTED_TRUE: string = 'Accepted';
  private static COOKIE_NOTICE_EXPIRY_TIME_MONTHS: number = 1;

  constructor(
    private cookieService: CookieService,
    private cookiesNoticeDialog: MatDialog,
  ) { }

  public triggerIfNotAccepted(): void {
    if (this.cookieService.get(CookiesNoticeService.COOKIE_NOTICE_ACCEPTED_KEY) !==
        CookiesNoticeService.COOKIE_NOTICE_IS_ACCEPTED_TRUE) {
      setTimeout(() => this.openCookiesNoticeDialog(), 500);
    }
  }

  public doAccept(): void {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + CookiesNoticeService.COOKIE_NOTICE_EXPIRY_TIME_MONTHS);
    this.cookieService.set(
        CookiesNoticeService.COOKIE_NOTICE_ACCEPTED_KEY,
        CookiesNoticeService.COOKIE_NOTICE_IS_ACCEPTED_TRUE,
        {secure: true, expires: expiryDate, sameSite: 'Strict'});
    this.cookiesNoticeDialog.closeAll();
  }

  private openCookiesNoticeDialog() {
    const cookiesNoticeDialogRef = this.cookiesNoticeDialog.open(CookiesNoticeDialogComponent);
    cookiesNoticeDialogRef.disableClose = true;
  }
}
