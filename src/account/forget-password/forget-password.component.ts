import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;
  public messages: any[] = [];

  constructor(
    public service: ApiService,
    private router: Router,
    public location: Location,
    public toastr: ToastrService
  ) {
    this.formGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {}

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  Submit() {
    this.formSubmitted = true;

    if (!this.formGroup.valid) {
      return;

    } else {
      this.disable = true;

      let payload = {
        email: this.getControls('email').value,
        link: environment.passwordResetLink
      };
      
      this.service.mainCanvas(`resetPassword`,'post',payload).subscribe((response: any) => {

        if (response.status) {
           this.toastr.success(response.message, 'Success');
           this.messages.push(response.message)

        } else {
          this.toastr.error(response.message, 'Error');
          this.messages.push(response.message)

        }

        this.disable = false;
      });
    }
  }
}
