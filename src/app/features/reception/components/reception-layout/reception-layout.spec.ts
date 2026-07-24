import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionLayout } from './reception-layout';

describe('ReceptionLayout', () => {
  let component: ReceptionLayout;
  let fixture: ComponentFixture<ReceptionLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
