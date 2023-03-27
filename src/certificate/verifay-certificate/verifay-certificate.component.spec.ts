import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifayCertificateComponent } from './verifay-certificate.component';

describe('VerifayCertificateComponent', () => {
  let component: VerifayCertificateComponent;
  let fixture: ComponentFixture<VerifayCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifayCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifayCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
