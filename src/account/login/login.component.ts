import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from 'src/service/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formGroup: FormGroup;
  public formSubmitted = false;
  public showLoading: boolean = false;

  constructor(
    public service: ApiService,
    private router: Router,
    public location: Location
  ) {
    this.formGroup = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {}

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  Submit() {
    if (!this.formGroup.valid) {
      return;
    } else {
      this.showLoading = true;

      const formData = new FormData();

      formData.append('username', this.getControls('username').value);
      formData.append('password', this.getControls('password').value);
      formData.append('service', 'moodle_mobile_app');

      this.service.login(formData).subscribe((response: any) => {
        if ('token' in response) {
          this.service.token = response.token;
          this.getUserId(response.token);
        } else {
          alert(response.error);
          this.showLoading = false;
        }
      });
    }
  }

  getUserId(token: any) {
    const formData = new FormData();

    formData.append('wstoken', token);
    formData.append('wsfunction', 'core_webservice_get_site_info');
    formData.append('moodlewsrestformat', 'json');

    this.service.main(formData).subscribe((response: any) => {
      this.getProfileDetail(response.userid);
    });
  }

  getProfileDetail(userId: any) {
    const formData = new FormData();

    formData.append('wstoken', environment.adminToken);
    formData.append('wsfunction', 'core_user_get_users_by_field');
    formData.append('moodlewsrestformat', 'json');

    formData.append('field', 'id');
    formData.append('values[0]', userId);

    this.service.main(formData).subscribe((response: any) => {
      if (response.length) {
        let profile = response[0];

        let index = profile.customfields.findIndex(
          (element: any) => element.name == 'accountType'
        );

        profile.accountType =
          profile.customfields[index].value == 'company'
            ? 'company'
            : 'individual';

        this.service.userData = profile;

        let state: any = this.location.getState();

        if (state) {
          this.router.navigateByUrl(state.returnUrl, { state: state.course });
        } else {
          this.router.navigate(['/mycourse']);
        }
        this.showLoading = false;
      }
    });
  }
}
