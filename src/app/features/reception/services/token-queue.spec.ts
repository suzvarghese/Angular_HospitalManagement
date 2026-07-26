import { TestBed } from '@angular/core/testing';

import { TokenQueue } from './token-queue';

describe('TokenQueue', () => {
  let service: TokenQueue;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenQueue);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
