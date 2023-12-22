import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {CookiesNoticeService} from '../../../services/cookies-notice/cookies-notice.service';
import {ServerClientSyncService} from '../../../services/server-client-sync/server-client-sync.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, ReactiveFormsModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  constructor(
    private syncService: ServerClientSyncService,
    private cookiesNoticeService: CookiesNoticeService,
  ) {}

  ngOnInit() {
    if (this.syncService.isClientSide()) {
      this.cookiesNoticeService.triggerIfNotAccepted();
    }
  }
}
