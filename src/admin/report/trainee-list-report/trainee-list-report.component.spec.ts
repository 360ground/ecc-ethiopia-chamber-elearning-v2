import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeListReportComponent } from './trainee-list-report.component';

describe('TraineeListReportComponent', () => {
  let component: TraineeListReportComponent;
  let fixture: ComponentFixture<TraineeListReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraineeListReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
