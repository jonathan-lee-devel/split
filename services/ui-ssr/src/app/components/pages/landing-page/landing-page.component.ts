import {afterRender, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardWithIconComponent} from '../../lib/card-with-icon/card-with-icon.component';
import {LandingPageSplashTextComponent} from '../../lib/landing-page-splash-text/landing-page-splash-text.component';
import {CookiesNoticeService} from '../../../services/cookies-notice/cookies-notice.service';
import {SyncService} from '../../../services/sync/sync.service';
import {CookiesNoticeDialogComponent} from '../../lib/dialogs/cookies-notice-dialog/cookies-notice-dialog.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    CardWithIconComponent,
    LandingPageSplashTextComponent,
    CardWithIconComponent,
    CookiesNoticeDialogComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  constructor(
      syncService: SyncService,
      private cookiesNoticeService: CookiesNoticeService,
  ) {
    afterRender(() => {
      syncService.sync();
      this.cookiesNoticeService.triggerIfNotAccepted();
    });
  }
}

