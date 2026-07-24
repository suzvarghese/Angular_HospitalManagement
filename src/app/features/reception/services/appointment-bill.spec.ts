import { TestBed } from '@angular/core/testing';

import { AppointmentBill } from './appointment-bill';

describe('AppointmentBill', () => {
  let service: AppointmentBill;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentBill);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
