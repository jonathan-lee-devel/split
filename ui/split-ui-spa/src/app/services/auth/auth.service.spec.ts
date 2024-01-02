import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {DEFAULT_APP_PROVIDERS} from '../../default-app-providers';


describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: DEFAULT_APP_PROVIDERS,
    }).compileComponents();
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
