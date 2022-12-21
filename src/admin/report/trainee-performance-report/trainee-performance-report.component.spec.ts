import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineePerformanceReportComponent } from './trainee-performance-report.component';

describe('TraineePerformanceReportComponent', () => {
  let component: TraineePerformanceReportComponent;
  let fixture: ComponentFixture<TraineePerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraineePerformanceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineePerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
