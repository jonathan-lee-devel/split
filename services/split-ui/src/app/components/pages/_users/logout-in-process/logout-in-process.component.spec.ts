import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LogoutInProcessComponent} from './logout-in-process.component';

describe('LogoutInProcessComponent', () => {
  let component: LogoutInProcessComponent;
  let fixture: ComponentFixture<LogoutInProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutInProcessComponent],
    })
        .compileComponents();

    fixture = TestBed.createComponent(LogoutInProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
