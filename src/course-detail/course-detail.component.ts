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
  public index: any;
  public billReferenceNumber: any;

  public disabled: Boolean = false;
  public courseFeatures: any[] = [];
  public isModulesLoading: Boolean = false;
  public adminToken: any = environment.adminToken;
  public isEnrolledForThisCourse: Boolean = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  public readmore: boolean = true;
  public isExtraInfoLoading: boolean = false;
  public course_fee: any;
  queryParam: any;
  paymentId: any;
  public enrolling: boolean = false;

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
    this.index = this.actRoute.snapshot.paramMap.get('index');
    this.queryParam = this.actRoute.snapshot.queryParams;

    this.state = this.location.getState();
    this.state.short = this.state.public_description.substring(0, 200);

    // load user enrolled courses
    if (this.service.userData) {
      let inprogress = this.service.myCourses.inprogress;
      let completed = this.service.myCourses.completed;

      let merged = inprogress.concat(completed);

      let index = merged.findIndex((ele: any) => ele.id == +this.id);

      this.isEnrolledForThisCourse = index > -1 ? true : false;
    }

    if ('activities' in this.state) {
    } else {
      this.getDetailModules();
    }
    if ('extraInfo' in this.state) {
    } else {
      this.getExtraInfo();
    }

    if ('paymentId' in this.queryParam) {
      // payment is success so call update method
      this.getPaymentSideEffect(this.queryParam.paymentId);
      this.paymentId = this.queryParam.paymentId;
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
        // this.router.navigateByUrl('/learning', {
        //   state: this.state,
        // });
        window.open(`${environment.canvasUrl}/courses/${this.id}`, '_blank');
      } else {
        this.course_fee = this.state.extraInfo.attributes.course_fee;
        this.course_fee = this.course_fee == 'Free' ? 0 : +this.course_fee;

        if (this.course_fee == 0) {
          // check the login status and call start enrolling
          if (confirm(`are you sure want to start learning ?`)) {
            this.enroll();
          }
        } else {
          // start calling the meda pay after confirmation
          if (
            confirm(
              `this course is costs you ${this.course_fee} ETB. would you like to continue ?`
            )
          ) {
            // start calling mega pay
            this.savePaymentSideEffect();
          }
        }
      }
    }
  }

  /* This is the code for enrolling the user to the course. */
  enroll() {
    let data: any = {
      enrollment: {
        user_id: this.service.userData.id,
        type: 'StudentEnrollment',
        enrollment_state: 'active',
        notify: true,
        self_enrolled: true,
      },
    };

    this.enrolling = true;

    this.service
      .mainCanvas(`selfEnroll/${this.id}`, 'post', data)
      .subscribe((response: any) => {
        if (response.status) {
          // add course to local variable
          this.state.percentage = 0;
          this.state.modules_published = true;
          this.service.myCourses.inprogress.push(this.state);
          this.router.navigate(['/mycourse']);
          this.openSnackBar(response.message, 'Dismiss');
        } else {
          this.openSnackBar(response.message, 'Dismiss');
        }

        this.enrolling = false;
      });
  }

  savePaymentSideEffect() {
    let data = {
      student_id: this.service.userData.id,
      course_id: this.id,
      course_title: this.state.name,
      course_code: this.state.course_code,
      status: 'pending',
    };

    this.service
      .mainCanvas(`createPaymentSideeffect`, 'post', data)
      .subscribe((response: any) => {
        if (response.status) {
          this.startPayment(response.message.id);
        }
      });
  }

  updatePaymentSideEffect(data: any, message: any = null) {
    this.service
      .mainCanvas(`createPaymentSideeffect`, 'post', data)
      .subscribe((response: any) => {
        if (response.status) {
          message ? alert(message) : null;
        }
      });
  }

  getPaymentSideEffect(paymentId: any) {
    this.service
      .mainCanvas(`getPaymentSideeffect/${paymentId}`, 'get', {})
      .subscribe((response: any) => {
        this.checkBillOnMedaPay(response[0].billReferenceNumber);
      });
  }

  checkBillOnMedaPay(billReferenceNumber: any) {
    let url: any = `${environment.medapayUrl}/${billReferenceNumber}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${environment.medapayToken}`,
      },
      referrer: '',
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status == 'completed') {
          let message: any = 'payment succesfull.';

          let data = {
            status: response.status,
            id: this.paymentId,
          };
          this.updatePaymentSideEffect(data, message);
        } else {
          alert(
            'payment is not complete. whether you are not pay successfully or something happen. tray again.'
          );
          this.disabled = false;
        }
      })
      .catch((error) => {
        this.disabled = false;
      });
  }

  startPayment(paymentId: any) {
    this.disabled = true;

    let data = {
      purchaseDetails: {
        orderId: 'Not Required',
        description: `Payment For the course : ${this.state.name}`,
        amount: +this.course_fee,
        customerName: this.service.userData.name,
        customerPhoneNumber: this.service.userData.phonenumber,
      },
      redirectUrls: {
        returnUrl: `${window.location.origin}//detail/${this.id}/${this.index}?paymentId=${paymentId}`,
        cancelUrl: `${window.location.origin}/detail/${this.id}/${this.index}`,
        callbackUrl: environment.callBackUrlAfterPayment,
      },
      metaData: {
        student_name: this.service.userData.name,
        course_name: this.state.name,
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
        let data = {
          billReferenceNumber: response.billReferenceNumber,
          id: paymentId,
        };
        this.updatePaymentSideEffect(data);

        if (response.status == 'created') {
          window.open(response.link.href);
        } else {
          alert('unable to process the payment now. please try again later.');
          this.disabled = false;
        }
      })
      .catch((error) => {
        this.disabled = false;
        console.log(error);
      });
  }

  getDetailModules() {
    this.isModulesLoading = true;
    this.service
      .mainCanvas(`getAllModules/${this.id}`, 'get', null)
      .subscribe((response: any) => {
        this.state.activities = response;
        this.service.loadedCourses[this.index].activities = response;
        this.isModulesLoading = false;
      });
  }

  getExtraInfo() {
    this.isExtraInfoLoading = true;
    this.service
      .mainCanvas(`getCourseExtraInfo/${this.id}`, 'get', null)
      .subscribe((response: any) => {
        response.features = Object.values(response.features);
        this.state.extraInfo = response;
        this.service.loadedCourses[this.index].extraInfo = response;
        this.isExtraInfoLoading = false;
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
