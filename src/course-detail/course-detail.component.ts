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

import { ToastrService } from 'ngx-toastr';

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
    public _snackBar: MatSnackBar,
    public toastr: ToastrService
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
      this.checkBill(this.queryParam.paymentId);
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
          let message = `this course is costs you ${this.course_fee} ETB. would you like to continue ?`;
          
          if (
            confirm(message)
          ) {
            // start calling mega pay
            this.createPaymentSideEffect();
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

  createPaymentSideEffect() {
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
          this.createPaymentReference(response.message.id);
        } else {
          this.toastr.error(response.message, 'Error');
          this.disabled = false;
        }
      });
  }

  checkBill(paymentId: any) {
    this.service
      .mainCanvas(`getPaymentSideeffect/${paymentId}`, 'get', {})
      .subscribe((response: any) => {
        let billReferenceNumber = response[0].billReferenceNumber;

        this.service
          .mainCanvas(`verifayPayment/${billReferenceNumber}/${paymentId}`, 'get', {})
          .subscribe((response: any) => {
            if(response.status){
              // call to enroll
              this.enroll();
    
            } else {
              this.toastr.error(response.message, 'Error');
              this.disabled = false;
            }
          });
      });
  }

  createPaymentReference(paymentId: any) {
    this.disabled = true;

    let payload = {
      purchaseDetails: {
        orderId: 'Not Required',
        description: `Payment For the course : ${this.state.name}`,
        amount: +this.course_fee,
        customerName: this.service.userData.name,
        customerPhoneNumber: this.service.userData.phonenumber,
      },
      redirectUrls: {
        returnUrl: `${window.location.origin}/detail/${this.id}/${this.index}?paymentId=${paymentId}`,
        cancelUrl: `${window.location.origin}/detail/${this.id}/${this.index}`,
        callbackUrl: environment.callBackUrlAfterPayment,
      },
      metaData: {
        student_name: this.service.userData.name,
        course_name: this.state.name,
        paymentId: paymentId
      },
    };

    this.service
      .mainCanvas(`createPaymentReference`, 'post', payload)
      .subscribe((response: any) => {
        if(response.status){
          window.open(response.message.link.href);
            
        } else {
          this.toastr.error(response.message, 'Error');
          this.disabled = false;
        }
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
