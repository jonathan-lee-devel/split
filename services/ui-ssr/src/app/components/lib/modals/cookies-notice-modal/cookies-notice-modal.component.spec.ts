import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesNoticeModalComponent } from './cookies-notice-modal.component';

describe('CookiesNoticeModalComponent', () => {
  let component: CookiesNoticeModalComponent;
  let fixture: ComponentFixture<CookiesNoticeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiesNoticeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CookiesNoticeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
