import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWithLinkComponent } from './card-with-link.component';

describe('CardWithLinkComponent', () => {
  let component: CardWithLinkComponent;
  let fixture: ComponentFixture<CardWithLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWithLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardWithLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
