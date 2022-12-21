import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from 'src/shared/confirmation.service';

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
  public isFree: Boolean = true;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  public readmore: boolean = true;
  public isExtraInfoLoading: boolean = false;
  public courseFee: any;
  queryParam: any;
  paymentId: any;
  public enrolling: boolean = false;
  public paymnetSettlement: any[] = [];
  public courseQuizzes: any[] = [];

  constructor(
    public service: ApiService,
    public actRoute: ActivatedRoute,
    public location: Location,
    public router: Router,
    public _snackBar: MatSnackBar,
    public toastr: ToastrService,
    public confirmation: ConfirmationService

  ) {}
 

  ngOnInit(): void {
    let queryParam: any = this.actRoute.snapshot.queryParams;
    this.paymentId = queryParam.paymentId;

    if(queryParam !== undefined){
      if ('paymentId' in queryParam) {
        this.checkBill(this.paymentId);
        
      } else if ('paymentCancel' in queryParam) {
        this.disabled = false;
        this.toastr.info('Payment canceld by User', 'Information');
  
      }

    } 
    
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.index = this.actRoute.snapshot.paramMap.get('index');

    this.state = this.location.getState();
    
    this.state.short = this.state.public_description !== undefined  ? this.state.public_description?.substring(0, 200) : '';
  
    if(this.service.userData){
      this.checkPaymnetSettlement();
    }

    // load user enrolled courses
    if (this.service.userData?.profile?.accountType == 'individual' && this.service.myCourses) {
      let inprogress: any[] = this.service.myCourses.inprogress;
      let completed: any[] = this.service.myCourses.completed;

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
    this.confirmation.confirm('Confirmation', 'Are you registerd user or new user ?','Existing User','New User','lg')
    .then((confirmed) => {
     confirmed ? this.login() : this.signup();
    })
    .catch(() => null);

    } else {
      if (this.isEnrolledForThisCourse) {
        window.open(`${environment.canvasUrl}/courses/${this.id}`, '_blank');
      } else {
        this.courseFee = this.state.extraInfo?.attributes.courseFee;

        if (this.courseFee == 0) {
          // check the login status and call start enrolling
          this.confirmation.confirm('Confirmation', 'Are you sure want to start learning ?','Yes','No','lg')
          .then((confirmed) => {
           confirmed ? this.enroll() : null
          })
          .catch(() => null);


        } else {
          // check if the user is payed or not for the course

          if(this.paymnetSettlement.length){
            this.confirmation.confirm('Confirmation', 'Are you sure want to start learning ?','Yes','No','lg')
            .then((confirmed) => {
            confirmed ? this.enroll() : null
            })
            .catch(() => null);

          } else {

            // start calling the meda pay after confirmation
            let message = `this course is costs you ${this.courseFee} ETB. would you like to continue ?`;
      
            this.confirmation.confirm('Confirmation', message,'Yes','No','lg')
            .then((confirmed) => {
             if(confirmed) {
              this.enrolling = true;
              // start calling mega pay
                this.createPaymentSideEffect();
             }
            })
            .catch(() => null);

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
         
          let data = {
            userId: this.service.userData.id,
            courseId: this.id,
            courseTitle: this.state.name,
            requiredModules: 0,
            completedModules: 0,
            progress: 0,
            traineeName: this.service.userData.short_name,
            traineeSex: this.service.userData.profile.sex,
            traineeLocation: `${this.service.userData.profile.city}, ${this.service.userData.profile.country}`
          }

          this.service
          .mainCanvas(`createEnrollmentSideEffect`, 'post', data)
          .subscribe((result: any) => {

            let data = {
              moduleName: modules.name,
              assessmentName: item.title,
              quizId: item.id,
              courseId: course.courseId,
              courseTitle: course.courseTitle,
              userId: this.userData.id,
              traineeName: this.userData.short_name,
              traineeSex: this.userData.profile.sex,
              traineeLocation: `${this.userData.profile.city}, ${this.userData.profile.country}`
            };

            this.service
            .mainCanvas(`createAssessmentSideEffect`, 'post', data)
            .subscribe((result: any) => {

            });






            
            if(!result.status){
              this.toastr.error(result.message, 'Error');
            }
            
            // add course to local variable
            this.state.percentage = 0;
            this.state.modules_published = true;
            this.service.myCourses.inprogress.push(this.state);
            this.disabled = false;
            this.router.navigate(['/mycourse']);
            this.toastr.success(response.message, 'Success');
  
            window.open(`${environment.canvasUrl}/courses/${this.id}`, '_blank');

          });

        } else {
          this.toastr.error(response.message, 'Error');
        }

        this.enrolling = false;
      });
  }

  checkPaymnetSettlement() {

    let data = {
      studentId: this.service.userData.id,
      courseId: this.id,
    };

    this.service
      .mainCanvas(`checkPaymnetSettlement`, 'post', data)
      .subscribe((response: any) => {
        if (response.status) {
          this.paymnetSettlement = response.message;
          
        } else {
          this.toastr.error(response.message, 'Error');
        }
      });
  }

  createPaymentSideEffect() {
    this.disabled = true;

    let data = {
      studentId: this.service.userData.id,
      traineeName:this.service.userData.short_name,
      courseId: this.id,
      courseTitle: this.state.name,
      courseCode: this.state.course_code,
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
          this.enrolling = false;
        }
      });
  }

  checkBill(paymentId: any) {
    this.disabled = true;
    this.enrolling = true;

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
              this.enrolling  = false;
            }
          });
      });
  }

  createPaymentReference(paymentId: any) {

    let payload = {
        data: {
          purchaseDetails: {
            orderId: 'Not Required',
            description: `Payment For the course : ${this.state.name}`,
            amount: +this.courseFee,
            customerName: this.service.userData.name,
            customerPhoneNumber: this.service.userData.profile.phonenumber,
          },
          redirectUrls: {
            returnUrl: `${environment.applicationUrl}/detail/${this.id}/${this.index}?paymentId=${paymentId}&paymentSuccess=true`,
            cancelUrl: `${environment.applicationUrl}/detail/${this.id}/${this.index}?paymentId=${paymentId}&paymentCancel=true`,
            callbackUrl: `${environment.paymentSuccessCallbackUrl}/paymentSuccessCallBack`,
          },
          metaData: {
            student_name: this.service.userData.name,
            course_name: this.state.name,
            paymentId: paymentId
          }

        }
    };

    this.service
      .mainCanvas(`createPaymentReference`, 'post', payload)
      .subscribe((response: any) => {
        if(response.status){
          window.location.replace(response.message.link.href);
            
        } else {
          this.toastr.error(response.message, 'Error');
          this.disabled = false;

          this.enrolling = false;
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

        let message = response.message;

        if(message.length){
          message[0].attributes = JSON.parse(message[0].attributes);
          message[0].attributes.courseFee = +message[0].attributes.courseFee;

          message[0].features = Object.values(JSON.parse(message[0].features));

          this.state.extraInfo = message[0];
          this.service.loadedCourses[this.index].extraInfo = message[0];

          if(this.state.extraInfo.attributes.courseFee > 0) {
            this.isFree = false;
          }

        }
        
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

  login(){
    this.router.navigate(['/account/login'], {
      state: { returnUrl: `/detail/${this.id}`, course: this.state },
    });
  }

  signup(){
    this.router.navigateByUrl('/account/signup');
  }

}