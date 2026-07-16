import { TestBed } from '@angular/core/testing';

import { Reception } from './reception';

describe('Reception', () => {
  let service: Reception;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reception);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
