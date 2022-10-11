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
      this.getToken(this.queryParam.code);
    } else {
      window.location.replace(this.loginRedirectUrl);
    }
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  Submit() {
    if (!this.formGroup.valid) {
      return;
    } else {
      this.showLoading = true;

      const formData = new FormData();

      // let expression = /\S+@\S+\.\S+/;
      // let isEmailAddress = expression.test(this.getControls('username').value)
      //   ? true
      //   : false;

      formData.append('username', this.getControls('username').value);
      formData.append('password', this.getControls('password').value);
      formData.append('service', 'moodle_mobile_app');

      this.service.login(formData).subscribe((response: any) => {
        if ('token' in response) {
          this.service.token = response.token;
          // this.getUserId(response.token);
        } else {
          alert(response.error);
          this.showLoading = false;
        }
      });
    }
  }

  getToken(code: any) {
    let data: any = {
      grant_type: 'authorization_code',
      client_id: environment.canvasClient_id,
      client_secret: environment.canvasClient_secret,
      code: code,
    };

    this.service
      .mainCanvas('getToken', 'post', data)
      .subscribe((response: any) => {
        this.service.token = response.access_token;
        this.getProfileDetail(response.user.id);
      });
  }

  getCustomData(profile: any) {
    this.service
      .mainCanvas(`getUserCustomData/${profile.id}`, 'get', {})
      .subscribe((response: any) => {
        let customData: any = response.data;

        if (customData.accountType == 'company') {
          this.service.isIndividual = false;
        }
        profile = { ...profile, ...customData };
        this.service.userData = profile;

        this.getEnrolledCourses(profile.id);

        let state: any = this.location.getState();
        if (!state) {
          this.router.navigateByUrl(state.returnUrl, {
            state: state.course,
          });
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  getProfileDetail(userId: any) {
    this.service
      .mainCanvas(`getUserDetail/${userId}`, 'get', {})
      .subscribe((response: any) => {
        this.getCustomData(response);
        // this.showLoading = false;
      });
  }

  getEnrolledCourses(userId: any) {
    let extractedCourses: any[] = [];

    this.service
      .mainCanvas(`getUserEnrollment/${userId}`, 'get', {})
      .subscribe((enrollments: any[]) => {
        this.service
          .mainCanvas(`getAllEnrolledCourses/${userId}`, 'get', {})
          .subscribe((courses: any[]) => {
            enrollments.forEach((enrollment: any) => {
              courses.forEach((course: any) => {
                if (
                  enrollment.course_id == course.id &&
                  enrollment.type == 'StudentEnrollment'
                ) {
                  course.enrollment_id = enrollment.id;
                  extractedCourses.push(course);
                }
              });
            });

            this.separate(extractedCourses);
          });
      });
  }

  separate(data: any) {
    let completed: any[] = [];
    let inprogress: any[] = [];

    data.forEach((element: any, index: any) => {
      let progress = element.course_progress;

      if ('requirement_count' in progress) {
        element.percentage =
          (progress.requirement_completed_count / progress.requirement_count) *
          100;
        element.modules_published = true;
        if (
          progress.requirement_count == progress.requirement_completed_count
        ) {
          completed.push(element);
        } else {
          inprogress.push(element);
        }
      } else {
        element.percentage = 0;
        element.modules_published = false;
        inprogress.push(element);
      }
    });

    this.service.myCourses.completed = completed;
    this.service.myCourses.inprogress = inprogress;
  }
}
