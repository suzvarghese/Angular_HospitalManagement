import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBilling } from './lab-billing';

describe('LabBilling', () => {
  let component: LabBilling;
  let fixture: ComponentFixture<LabBilling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabBilling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabBilling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
