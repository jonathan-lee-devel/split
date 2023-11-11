import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleLoginProcessingComponent } from './google-login-processing.component';

describe('GoogleLoginProcessingComponent', () => {
  let component: GoogleLoginProcessingComponent;
  let fixture: ComponentFixture<GoogleLoginProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleLoginProcessingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleLoginProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
