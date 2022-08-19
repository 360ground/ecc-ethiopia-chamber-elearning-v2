import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})
export class CourseDetailComponent implements OnInit {
  public detail: any;
  public state: any;
  public id: any;
  public paymentReferenceNumber: any;

  public disabled: Boolean = false;
  public courseFeatures: any[] = [];
  public isModulesLoading: Boolean = false;
  public adminToken: any = environment.adminToken;
  public isEnrolledForThisCourse: Boolean = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public service: ApiService,
    public actRoute: ActivatedRoute,
    public location: Location,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  openSnackBar(message: any, btnText: any) {
    this._snackBar.open(message, btnText, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.state = this.location.getState();

    if (this.service.userData) {
      let inprogress = this.service.myCourses.inprogress;
      let completed = this.service.myCourses.completed;

      let merged = inprogress.concat(completed);

      let index = merged.findIndex((ele: any) => ele.id == +this.id);

      this.isEnrolledForThisCourse = index > -1 ? true : false;
    }

    if (this.state.customfields[2].value) {
      this.courseFeatures = this.state.customfields[2].valueraw.split(',');
    }

    if ('activities' in this.state) {
    } else {
      this.getDetailModules();
    }
  }

  getCustomeFieldValue(customFields: any[], name: any) {
    let result = customFields.find((element) => element.shortname == name);

    if (result) {
      return result.value;
    } else {
      return 'N/A';
    }
  }

  startLearning() {
    if (!this.service.userData) {
      this.router.navigate(['/account/login'], {
        state: { returnUrl: `/detail/${this.id}`, course: this.state },
      });
    } else {
      if (this.isEnrolledForThisCourse) {
        this.router.navigateByUrl('/learning', {
          state: this.state,
        });
      } else {
        if (this.state?.customfields[0]?.valueraw) {
          // check the login status and call start enrolling
          if (confirm(`are you sure want to start learning ?`)) {
            this.enroll();
          }
        } else {
          // start calling the meda pay after confirmation
          if (
            confirm(
              `this course is costs you ${this.state?.customfields[1]?.valueraw} ETB. would you like to continue ?`
            )
          ) {
            // start calling mega pay
            this.startPayment();
          }
        }
      }
    }
  }

  enroll() {
    /* This is the code for enrolling the user to the course. */
    const formData = new FormData();

    formData.append('wstoken', this.service.token);
    formData.append('wsfunction', 'enrol_self_enrol_user');
    formData.append('moodlewsrestformat', 'json');
    formData.append('courseid', this.id);

    this.service.main(formData).subscribe((response: any) => {
      if (response.status) {
        this.openSnackBar('Course is added to learning plan', 'Dismiss');
        this.router.navigate(['/mycourse']);
      } else {
        this.openSnackBar(response.warnings[0].message, 'Dismiss');
      }
    });
  }

  startPayment() {
    this.disabled = true;

    let data = {
      purchaseDetails: {
        orderId: 'Not Required',
        description: `Payment For the course : ${this.state.fullname}`,
        amount: +this.state.customfields[1].valueraw,
        customerName: `${this.service.userData.fullname}`,
        customerPhoneNumber: this.service.userData.customfields[0].value,
      },
      redirectUrls: {
        returnUrl: `${window.location.origin}`,
        cancelUrl: 'google.com',
        callbackUrl: 'google.com',
      },
      metaData: {
        'student name': `${this.service.userData.fullname}`,
        course_name: `${this.state.fullname}`,
      },
    };

    fetch(environment.medapayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${environment.medapayToken}`,
      },
      body: JSON.stringify(data),
      referrer: '',
    })
      .then((response) => response.json())
      .then((response) => {
        this.paymentReferenceNumber = response;

        if (response.status == 'created') {
          window.open(response.link.href, '_blank');
        } else {
          alert('unable to process the payment now.please try again later.');
          this.disabled = false;
        }
      })
      .catch((error) => {
        this.disabled = false;
      });
  }

  getDetailModules() {
    this.isModulesLoading = true;

    const formData = new FormData();

    formData.append('wstoken', environment.adminToken);
    formData.append('wsfunction', 'core_course_get_contents');
    formData.append('moodlewsrestformat', 'json');
    formData.append('courseid', this.id);

    this.service.main(formData).subscribe((response: any) => {
      this.state.activities = response;
      this.service.loadedCourses[0].activities = response;
      this.isModulesLoading = false;
      console.log(response);
    });
  }

  scroll(direction: any) {
    let container: any = document.getElementById('moduleCardsContainer');

    let scrollCompleted = 0;

    var slideVar = setInterval(function () {
      if (direction == 'left') {
        container.scrollLeft -= 40;
      } else {
        container.scrollLeft += 40;
      }
      scrollCompleted += 40;
      if (scrollCompleted >= 100) {
        window.clearInterval(slideVar);
      }
    }, 50);
  }
}
