import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {decrement, increment, reset, selectCounter} from '../../../+state/';
import {CookiesNoticeService} from '../../../services/cookies-notice/cookies-notice.service';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  count$: Observable<number>;

  constructor(
    private store: Store,
    private cookiesNoticeService: CookiesNoticeService,
  ) {
    this.count$ = this.store.select(selectCounter);
  }

  ngOnInit() {
    this.cookiesNoticeService.triggerIfNotAccepted();
  }

  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement());
  }

  reset() {
    this.store.dispatch(reset());
  }
}
