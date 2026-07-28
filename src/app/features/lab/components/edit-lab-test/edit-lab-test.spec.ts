import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabTest } from './edit-lab-test';

describe('EditLabTest', () => {
  let component: EditLabTest;
  let fixture: ComponentFixture<EditLabTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLabTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLabTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
