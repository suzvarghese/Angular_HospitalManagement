import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLabTests } from './manage-lab-tests';

describe('ManageLabTests', () => {
  let component: ManageLabTests;
  let fixture: ComponentFixture<ManageLabTests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLabTests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLabTests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
