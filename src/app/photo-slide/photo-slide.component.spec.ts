import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoSlideComponent } from './photo-slide.component';

describe('PhotoSlideComponent', () => {
  let component: PhotoSlideComponent;
  let fixture: ComponentFixture<PhotoSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoSlideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
