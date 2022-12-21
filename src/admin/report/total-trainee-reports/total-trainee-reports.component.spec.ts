import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTraineeReportsComponent } from './total-trainee-reports.component';

describe('TotalTraineeReportsComponent', () => {
  let component: TotalTraineeReportsComponent;
  let fixture: ComponentFixture<TotalTraineeReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalTraineeReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalTraineeReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
