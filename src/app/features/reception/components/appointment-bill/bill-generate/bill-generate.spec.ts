import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillGenerate } from './bill-generate';

describe('BillGenerate', () => {
  let component: BillGenerate;
  let fixture: ComponentFixture<BillGenerate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillGenerate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillGenerate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
