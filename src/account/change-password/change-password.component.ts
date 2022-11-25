import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import { CustomValidators } from '../signup/password-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;

  constructor(public service: ApiService, private router: Router, public toastr: ToastrService,) {
    this.formGroup = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10),
        CustomValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
          requiresDigit: true,
        }),
        CustomValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
          requiresUppercase: true,
        }),
        CustomValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
          requiresLowercase: true,
        }),
        CustomValidators.patternValidator(new RegExp('(?=.*[$@^!%*?&])'), {
          requiresSpecialChars: true,
        })
      ]),
      repassword: new FormControl(null, Validators.required),
      // oldPassword: new FormControl(null, Validators.required),
    },[CustomValidators.MatchValidator('password', 'repassword')]);
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
        login: { 
          password: this.getControls('password').value
        }
      };
      
      let url: any = `changePassword/${this.service.userData.account_id}/${this.service.userData.login_id}`;

      this.service.mainCanvas(url,'post',payload).subscribe((response: any) => {

        if (response.status) {
           this.toastr.success(response.message, 'Success');

        } else {
          this.toastr.error(response.message, 'Error');

        }

        this.disable = false;
      });
   
    }
  }
  
}
