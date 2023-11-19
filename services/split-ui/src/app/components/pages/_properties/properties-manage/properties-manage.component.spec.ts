import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesManageComponent } from './properties-manage.component';

describe('PropertiesManageComponent', () => {
  let component: PropertiesManageComponent;
  let fixture: ComponentFixture<PropertiesManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropertiesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
