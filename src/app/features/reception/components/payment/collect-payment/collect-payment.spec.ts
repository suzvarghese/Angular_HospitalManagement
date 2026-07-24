import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectPayment } from './collect-payment';

describe('CollectPayment', () => {
  let component: CollectPayment;
  let fixture: ComponentFixture<CollectPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
