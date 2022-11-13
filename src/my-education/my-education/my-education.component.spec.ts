import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEducationComponent } from './my-education.component';

describe('MyEducationComponent', () => {
  let component: MyEducationComponent;
  let fixture: ComponentFixture<MyEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyEducationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
