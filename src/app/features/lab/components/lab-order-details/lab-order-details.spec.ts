import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOrderDetails } from './lab-order-details';

describe('LabOrderDetails', () => {
  let component: LabOrderDetails;
  let fixture: ComponentFixture<LabOrderDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabOrderDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabOrderDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
