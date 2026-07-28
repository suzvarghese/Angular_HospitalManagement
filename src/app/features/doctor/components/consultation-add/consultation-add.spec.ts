import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationAdd } from './consultation-add';

describe('ConsultationAdd', () => {
  let component: ConsultationAdd;
  let fixture: ComponentFixture<ConsultationAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
