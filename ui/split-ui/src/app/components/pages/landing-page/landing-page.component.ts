import {afterRender, Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {SyncService} from '../../../services/sync/sync.service';
import {CookiesNoticeService} from '../../../services/cookies-notice/cookies-notice.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, ReactiveFormsModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  constructor(
      private syncService: SyncService,
      private cookiesNoticeService: CookiesNoticeService,
  ) {
    afterRender(() => {
      this.syncService.sync();
    });
  }

  ngOnInit() {
    if (this.syncService.isClientSide()) {
      this.cookiesNoticeService.triggerIfNotAccepted();
    }
  }
}
