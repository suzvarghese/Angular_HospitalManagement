import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Pharmacy } from './pharmacy';

describe('Pharmacy', () => {
  let service: Pharmacy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Pharmacy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
