import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientUpdate } from './patient-update';

describe('PatientUpdate', () => {
  let component: PatientUpdate;
  let fixture: ComponentFixture<PatientUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
