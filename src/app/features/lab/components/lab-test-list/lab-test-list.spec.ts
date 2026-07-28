import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestList } from './lab-test-list';

describe('LabTestList', () => {
  let component: LabTestList;
  let fixture: ComponentFixture<LabTestList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTestList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTestList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
