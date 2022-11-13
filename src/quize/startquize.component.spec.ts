import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartQuizeComponent } from './startquize.component';

describe('QuizeComponent', () => {
  let component: StartQuizeComponent;
  let fixture: ComponentFixture<StartQuizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartQuizeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StartQuizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
