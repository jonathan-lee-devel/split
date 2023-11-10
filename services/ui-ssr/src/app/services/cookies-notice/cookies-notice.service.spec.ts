import { TestBed } from '@angular/core/testing';

import { CookiesNoticeService } from './cookies-notice.service';

describe('CookiesNoticeService', () => {
  let service: CookiesNoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookiesNoticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
