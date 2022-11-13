import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
})
export class NewPasswordComponent implements OnInit {
  public formGroup: FormGroup;
  public formSubmitted = false;
  public showLoading: boolean = false;
  public passwordChangeSuccess: Boolean = false;
  public passwordChangeErrors: any[] = [];
  public token: any;
  public userid: any;

  constructor(
    public service: ApiService,
    private router: Router,
    public actRoute: ActivatedRoute
  ) {
    this.token = this.actRoute.snapshot.paramMap.get('token');
    this.userid = this.actRoute.snapshot.paramMap.get('id');

    this.formGroup = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      repassword: new FormControl(null, Validators.required),
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
      if (
        this.getControls('password').value ==
        this.getControls('repassword').value
      ) {
        const formData = new FormData();

        formData.append('users[0][id]', this.userid);
        formData.append(
          'users[0][password]',
          this.getControls('password').value
        );

        formData.append('wstoken', this.token);
        formData.append('wsfunction', 'core_user_update_users');
        formData.append('moodlewsrestformat', 'json');

        this.service.main(formData).subscribe((response: any) => {
          if (!response.warnings.length) {
            this.formGroup.reset();
            this.passwordChangeSuccess = true;
            this.router.navigateByUrl('/account/login');
            this.passwordChangeErrors = [];
          } else {
            this.passwordChangeErrors = [];
            this.passwordChangeSuccess = false;
            this.passwordChangeErrors = response.warnings;
          }

          this.showLoading = false;
        });
      } else {
        this.passwordChangeErrors.push({
          message: 'password is not same.',
        });
      }
    }
  }
}
