import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouresExtraInfoComponent } from './coures-extra-info.component';

describe('CouresExtraInfoComponent', () => {
  let component: CouresExtraInfoComponent;
  let fixture: ComponentFixture<CouresExtraInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouresExtraInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouresExtraInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
