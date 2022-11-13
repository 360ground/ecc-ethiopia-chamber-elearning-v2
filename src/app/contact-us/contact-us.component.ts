import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;
  public error: boolean = false;
  public success: boolean = false;
  public errorMessage: any;

  constructor(
    private service: ApiService,
    private router: Router,
  ) {
    this.formGroup = new FormGroup({
        fullName: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required,Validators.email]),
        phoneNumber: new FormControl(null, Validators.required),
        message: new FormControl(null, [Validators.required]),  
      }) 
  }

  ngOnInit() {
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  Submit() {
    this.formSubmitted = true;
    if (!this.formGroup.valid) {
      return;
    } else {
      this.disable = true;

      this.service
        .mainCanvas('contactUs', 'post', this.formGroup.value)
        .subscribe((response: any) => {
          if (response.status) {
            this.success = true;
            this.disable = false;
          } else {
            this.errorMessage = response.message;
            this.error = true;
            this.disable = false;
          }
        });
    }
  }


}
