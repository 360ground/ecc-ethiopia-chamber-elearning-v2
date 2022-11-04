import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCertificateListComponent } from './my-certificate-list.component';

describe('MyCertificateListComponent', () => {
  let component: MyCertificateListComponent;
  let fixture: ComponentFixture<MyCertificateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCertificateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCertificateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
