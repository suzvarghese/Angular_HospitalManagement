import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabReport } from './lab-report';

describe('LabReport', () => {
  let component: LabReport;
  let fixture: ComponentFixture<LabReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
