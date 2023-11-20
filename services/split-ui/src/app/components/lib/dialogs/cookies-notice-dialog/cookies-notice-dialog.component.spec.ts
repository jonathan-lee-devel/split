import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CookiesNoticeDialogComponent} from './cookies-notice-dialog.component';

describe('CookiesNoticeDialogComponent', () => {
  let component: CookiesNoticeDialogComponent;
  let fixture: ComponentFixture<CookiesNoticeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiesNoticeDialogComponent],
    })
        .compileComponents();

    fixture = TestBed.createComponent(CookiesNoticeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
