import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabTest } from './add-lab-test';

describe('AddLabTest', () => {
  let component: AddLabTest;
  let fixture: ComponentFixture<AddLabTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLabTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLabTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
