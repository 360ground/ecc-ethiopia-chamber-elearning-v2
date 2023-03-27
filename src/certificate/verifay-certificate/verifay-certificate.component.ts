import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-verifay-certificate',
  templateUrl: './verifay-certificate.component.html',
  styleUrls: ['./verifay-certificate.component.css']
})
export class VerifayCertificateComponent implements OnInit {

  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;

  public result: any = null;
  public messages: any [] = [];

  constructor(
    private service: ApiService,
  ) {
    this.formGroup = new FormGroup({
        code: new FormControl(null, Validators.required),  
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
      this.messages = [];

      this.service
        .mainCanvas('verifayCertificate', 'post', this.formGroup.value)
        .subscribe((response: any) => {
          if (response.status) {
            this.formSubmitted = false;
            
            let result = `Certificate is given for the person named by ${response.message.studentName} for the course ${response.message.courseName} at ${response.message.createdAt}`
            this.messages.push({ message: result, type: 'success' });

          }  else {
            this.messages.push({ message: response.message, type: 'danger' });
          }
          
          this.disable = false;
          this.formGroup.enable();

        });
    }

  }
}
