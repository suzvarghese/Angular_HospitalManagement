import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayQueue } from './today-queue';

describe('TodayQueue', () => {
  let component: TodayQueue;
  let fixture: ComponentFixture<TodayQueue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayQueue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayQueue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
