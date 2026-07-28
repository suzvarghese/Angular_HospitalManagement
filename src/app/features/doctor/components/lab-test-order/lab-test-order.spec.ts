import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestOrder } from './lab-test-order';

describe('LabTestOrder', () => {
  let component: LabTestOrder;
  let fixture: ComponentFixture<LabTestOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTestOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTestOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
