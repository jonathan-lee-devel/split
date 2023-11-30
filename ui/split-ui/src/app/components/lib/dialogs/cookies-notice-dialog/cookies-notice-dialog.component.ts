import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {A11yModule} from '@angular/cdk/a11y';
import {CookiesNoticeService} from '../../../../services/cookies-notice/cookies-notice.service';

@Component({
  selector: 'app-cookies-notice-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    A11yModule,
  ],
  templateUrl: './cookies-notice-dialog.component.html',
  styleUrl: './cookies-notice-dialog.component.scss',
})
export class CookiesNoticeDialogComponent {
  constructor(
    private cookiesNoticeService: CookiesNoticeService,
  ) { }


  acceptCookiesNotice() {
    this.cookiesNoticeService.doAccept();
  }
}
