import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from 'src/service/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public queryParam: any;

  public formGroup: FormGroup;
  public formSubmitted = false;
  public showLoading: boolean = false;

  public loginRedirectUrl: any = `${environment.canvasUrl}/login/oauth2/auth?client_id=${environment.canvasClient_id}&response_type=code&redirect_uri=${environment.redirectUrlAfterLoginIncanvas}`;

  constructor(
    public service: ApiService,
    private router: Router,
    public location: Location,
    public actRoute: ActivatedRoute
  ) {
    this.formGroup = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.queryParam = this.actRoute.snapshot.queryParams;

    if ('code' in this.queryParam) {
      this.service.isAuthenticating = true;
      this.login(this.queryParam.code);
    } else {
      window.location.replace(this.loginRedirectUrl);
    }
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  login(code: any) {
    let data: any = {
      grant_type: 'authorization_code',
      client_id: environment.canvasClient_id,
      client_secret: environment.canvasClient_secret,
      code: code,
    };

    this.service
      .mainCanvas('login', 'post', data)
      .subscribe((response: any) => {

        this.service.token = response.access_token;

        if (response.accountType == 'company') {
          this.service.isIndividual = false;
        }

        this.service.userData = response;

        this.service.getEnrolledCourses(response.id);

        // check if the redirection
        let state: any = this.location.getState();

        if (!state) {
          // start from other page that require the login 
          this.router.navigateByUrl(state.returnUrl, {
            state: state.course,
          });
        } else {
          // or from login button
          this.router.navigate(['/']);
        }

        this.service.isAuthenticating = false;
     
      });
  }


}
