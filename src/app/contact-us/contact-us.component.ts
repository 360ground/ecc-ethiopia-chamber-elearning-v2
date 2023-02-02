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
  public error: boolean = false;
  public success: boolean = false;
  public messages: any [] = [];
  public disable: boolean = false;

  constructor(
    private service: ApiService,
    private router: Router,
  ) {
    this.formGroup = new FormGroup({
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
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

  closeMessage(index: any){
    this.messages.splice(index,1);
  }

  Submit() {
    this.formSubmitted = true;
    if (!this.formGroup.valid) {
      return;
    } else {
      this.disable = true;
      this.formGroup.disable();

      this.service
        .mainCanvas('contactUs', 'post', this.formGroup.value)
        .subscribe((response: any) => {
          if (response.status) {
            this.success = true;
            this.formGroup.reset();
            this.messages.push({ message: response.message, type: 'success' });
            this.formSubmitted = false;
          } else {
            this.messages.push({ message: response.message, type: 'danger' });
            this.error = true;
          }
          
          this.disable = false;
          this.formGroup.enable();

        });
    }
  }


}
