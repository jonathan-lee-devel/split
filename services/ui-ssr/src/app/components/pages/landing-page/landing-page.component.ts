import {afterRender, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardWithIconComponent} from '../../lib/card-with-icon/card-with-icon.component';
import {LandingPageSplashTextComponent} from '../../lib/landing-page-splash-text/landing-page-splash-text.component';
import {CookiesNoticeService} from '../../../services/cookies-notice/cookies-notice.service';
import {Modal} from 'flowbite';
import {ModalService} from '../../../services/modal/modal.service';
import {AuthService} from '../../../services/auth/auth.service';
import {SyncService} from '../../../services/sync/sync.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, CardWithIconComponent, LandingPageSplashTextComponent, CardWithIconComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements AfterViewInit {
  constructor(
      syncService: SyncService,
        private changeDetector: ChangeDetectorRef,
        private cookiesNoticeService: CookiesNoticeService,
  ) {
    afterRender(() => {
      syncService.sync();
      this.cookiesNoticeService.triggerIfNotAccepted();
    });
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }
}

