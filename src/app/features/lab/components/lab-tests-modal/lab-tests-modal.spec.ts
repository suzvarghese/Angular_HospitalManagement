import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestsModal } from './lab-tests-modal';

describe('LabTestsModal', () => {
  let component: LabTestsModal;
  let fixture: ComponentFixture<LabTestsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTestsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTestsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
