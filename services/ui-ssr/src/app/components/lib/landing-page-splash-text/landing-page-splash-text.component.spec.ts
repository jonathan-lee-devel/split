import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageSplashTextComponent } from './landing-page-splash-text.component';

describe('LandingPageSplashTextComponent', () => {
  let component: LandingPageSplashTextComponent;
  let fixture: ComponentFixture<LandingPageSplashTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageSplashTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandingPageSplashTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
