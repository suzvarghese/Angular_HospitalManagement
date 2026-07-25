import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabLayout } from './lab-layout';

describe('LabLayout', () => {
  let component: LabLayout;
  let fixture: ComponentFixture<LabLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
