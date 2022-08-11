import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  public formGroup: FormGroup;
  public formSubmitted = false;
  public showLoadingUsername: boolean = false;
  public showLoadingEmail: boolean = false;

  public backendError: any = null;
  public showResponseMessage: Boolean = false;

  constructor(
    public service: ApiService,
    private router: Router,
    public location: Location
  ) {
    this.formGroup = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {}

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  Submit(isForUsername: Boolean) {
    if (
      this.getControls('username').invalid &&
      this.getControls('email').invalid
    ) {
      return;
    } else {
      const formData = new FormData();

      formData.append('wstoken', environment.adminToken);
      formData.append('wsfunction', 'core_auth_request_password_reset');
      formData.append('moodlewsrestformat', 'json');

      if (isForUsername) {
        formData.append('username', this.getControls('username').value);
        this.showLoadingUsername = true;
      } else {
        formData.append('email', this.getControls('email').value);
        this.showLoadingEmail = true;
      }

      this.formGroup.disable();

      this.service.main(formData).subscribe((response: any) => {
        switch (response.status) {
          case 'emailpasswordconfirmmaybesent':
            this.backendError = response.notice;
            this.showResponseMessage = true;
            break;

          case 'emailpasswordconfirmnotsent':
            this.backendError = 'username not found';
            break;

          case 'emailpasswordconfirmnoemail':
            this.backendError = 'email not found';
            break;

          case 'emailalreadysent':
            this.backendError = 'email already sent.';
            break;

          case 'emailpasswordconfirmsent':
            this.backendError = 'User not confirm account.';
            break;

          case 'emailresetconfirmsent':
            this.backendError = 'Email sent.';
            break;
          case 'dataerror':
            this.backendError = response.warnings[0].message;
            break;
        }

        alert(this.backendError);

        this.formGroup.enable();
        this.showLoadingUsername = false;
        this.showLoadingEmail = false;
      });
    }
  }
}
