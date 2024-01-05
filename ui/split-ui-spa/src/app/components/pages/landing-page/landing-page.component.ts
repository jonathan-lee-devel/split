import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as CountActions from '../../../+state/counter/counter.actions';
import * as CountSelector from '../../../+state/counter/counter.selector';
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
    this.count$ = this.store.select(CountSelector.selectCounter);
  }

  ngOnInit() {
    this.cookiesNoticeService.triggerIfNotAccepted();
  }

  increment() {
    this.store.dispatch(CountActions.increment());
  }

  decrement() {
    this.store.dispatch(CountActions.decrement());
  }

  reset() {
    this.store.dispatch(CountActions.reset());
  }
}
