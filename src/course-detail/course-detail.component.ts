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

    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.index = this.actRoute.snapshot.paramMap.get('index');

    this.paymentId = queryParam.paymentId;

    if(queryParam !== undefined){
      if ('paymentId' in queryParam) {
        this.checkBill(this.paymentId); 
      }

      if ('courseId' in queryParam) {
        this.getCourseDetail(queryParam.courseId);
      }
    } 
    
    this.state = this.location.getState();
    
    if(this.state.attributes !== undefined) {
      console.log(this.state)
      this.id = this.state.attributes.id;

      this.initializeStates();
    }
      

  }

  initializeStates(){
    this.state.attributes ?
    this.state.attributes.short = 
    this.state.attributes?.public_description !== undefined  ?
     this.state.attributes?.public_description?.substring(0, 200) :
    '' : null;
  
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
   
    if(+this.state.courseFee > 0) {
      this.isFree = false;
    }
  }

  getCourseDetail(courseId: any){
    this.isModulesLoading = true;
    this.service
    .mainCanvas(`getCourseExtraInfo/${courseId}`, 'get', null)
    .subscribe((response: any) => {
      if(response.status){
        let message = response.message[0];

        message.attributes = JSON.parse(message.attributes);
        message.features = Object.values(JSON.parse(message.features));

        if (location.protocol == 'http:'){

          if(message.attributes.image_download_url){
            message.attributes.image_download_url = message.attributes.image_download_url.replace('https', 'http');

          }

        }

        this.state = message;
        this.id = courseId;
        this.initializeStates();

      } else {
        this.toastr.error(response.message, 'Error');
      }

    });
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
        this.courseFee = +this.state.courseFee;

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
           // add course to local variable
           this.state.percentage = 0;
           this.state.modules_published = true;
           this.service.myCourses.inprogress.push(this.state);
           this.disabled = false;
           this.router.navigate(['/mycourse']);
           this.toastr.success(response.message, 'Success');
 
           window.open(`${environment.canvasUrl}/courses/${this.id}`, '_blank');

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
      courseTitle: this.state.attributes.name,
      courseCode: this.state.attributes.course_code,
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
      .mainCanvas(`getPaymentSideeffectById/${paymentId}`, 'get', {})
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
            description: `Payment For the course : ${this.state.attributes.name}`,
            amount: +this.courseFee,
            customerName: this.service.userData.name,
            customerPhoneNumber: this.service.userData.profile.phonenumber,
          },
          redirectUrls: {
            returnUrl: `${environment.applicationUrl}?id=${this.id}&paymentId=${paymentId}&paymentSuccess=true`,
            cancelUrl: `${environment.applicationUrl}?paymentId=${paymentId}&paymentCancel=true`,
            callbackUrl: `${environment.paymentSuccessCallbackUrl}/paymentSuccessCallBack`,
          },
          metaData: {
            student_name: this.service.userData.name,
            course_name: this.state.attributes.name,
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
      if(response.status){
        this.state.activities = response.message;
        this.index ? this.service.loadedCourses[this.index].activities = response.message : null;

      } else {
        this.toastr.error(response.message, 'Error');
      }

      this.isModulesLoading = false;
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

  confirm(){
    this.confirmation.confirm('Confirmation', 'Are you registerd user or new user ?','Existing User','New User','lg')
    .then((confirmed) => {
     confirmed ? this.login() : this.signup();
    })
    .catch(() => null);
  }

  login(){
    this.router.navigate(['/account/login'], {
      state: { returnUrl: `/courseDetail`, course: this.state },
    });
  }

  signup(){
    this.router.navigateByUrl('/account/signup');
  }

}