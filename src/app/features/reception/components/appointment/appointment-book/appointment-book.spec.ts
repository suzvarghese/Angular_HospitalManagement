import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentBook } from './appointment-book';

describe('AppointmentBook', () => {
  let component: AppointmentBook;
  let fixture: ComponentFixture<AppointmentBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
