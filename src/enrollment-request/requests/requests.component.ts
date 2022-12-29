import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { concatMap, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfirmationService } from 'src/shared/confirmation.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  public requests: any = [];
  public requestDetail: any = null;
  public index: any;
  public disable: Boolean = false;
  public showEnrollSpinner: Boolean = false;
  public showDeclineSpinner: Boolean = false;
  public showApproveSpinner: Boolean = false;

  public failedAttemptsMessage: any[] = [];
  public remainingTrainees: any[] = [];
  public enrolledTrainees: any[] = [];
  public failedAttempts: any[] = [];
  public isFiltering: boolean = false;
  public isLoading: boolean = false;


  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    public confirmation: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadRequest();
  }

  loadRequest(){
    this.isLoading = true;

    this.service
      .mainCanvas(`getAllEnrollmentRequest`, 'get', {})
      .subscribe((response: any) => {
        if (response.status) {
          this.requests = response.message;

        } else {
          this.toastr.error(response.message, 'Error');

        }

        this.isLoading = false;
      });
  }

  viewDetail(index: any, request: any){
    this.requestDetail = request;
    
    if(!Array.isArray(this.requestDetail.students)){
      this.requestDetail.students = Object.values(JSON.parse(this.requestDetail.students));
    }

    this.index = index;
    this.checkRemainingTrainees();
  }

  back(){
    this.requestDetail = null;
  }
  
  updateRequest(status: any){
    this.confirmation.confirm('Confirmation', `Are you sure want to ${status} this request ?`,'Yes','No','lg')
    .then(async (confirmed) => {
     if(confirmed) {
      this.disable = true;

      status == 'approve' ? this.showApproveSpinner = true : this.showDeclineSpinner = true;

      let payload = {
        id: this.requestDetail.id,
        status: status == 'approve' ? 'Approved' : 'Declined'
      };
  
      this.service
        .mainCanvas(`updateEnrollmentRequest`, 'post', payload)
        .subscribe((response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success');
            this.requests[this.index].status = status == 'approve' ? 'Approved' : 'Declined';

            status == 'approve' ? this.showApproveSpinner = false : this.showDeclineSpinner = false;
            
            this.disable = false;

          } else {
            this.toastr.error(response.message, 'Error');
            status == 'approve' ? this.showApproveSpinner = false : this.showDeclineSpinner = false;

            this.disable = false;

          }
      });

     }

    })
    .catch(() => null);
  }

  openAttachment(attachment: any){
    let url = `${environment.baseUrlBackend}/uploads/requests/${this.requestDetail.id}`;

    if(attachment == 'bankSlip'){
      window.open(`${url}/bankSlip.pdf`, '_blank');
      
    } else {
      window.open(`${url}/traineelist.pdf`, '_blank');
    }
  }

  enrollTrainee(){
    if(this.requestDetail.status !== 'Approved'){
      this.toastr.error('the request must be approved before enrolling the trainee`s','Error');

    } else {
      this.confirmation.confirm('Confirmation', `Are you sure want to enroll ${this.requestDetail.students.length} trainee's  ?`,'Yes','No','lg')
      .then(async (confirmed) => {
      if(confirmed) {
        this.showEnrollSpinner = true;
  
        let data: any = {
          enrollment: {
            type: 'StudentEnrollment',
            enrollment_state: 'active',
            notify: true,
            self_enrolled: false,
          }
        };

        // collection of requests for fork request
        let requests: any[] = [];
        // let enrollmentSideeffect: any[] = [];

        this.requestDetail.students.forEach(async (element: any, index: any) => {
          data.enrollment.user_id = element.id; element.isEnrolling = true; element.index = index;
          
          requests.push(this.service.mainCanvas(`selfEnroll/${this.requestDetail.course_id}`, 'post', data));

          // enrollmentSideeffect.push(this.service.mainCanvas(`createEnrollmentSideEffect`, 'post', 
          //   {
          //     courseId: this.requestDetail.course_id,
          //     courseTitle: this.requestDetail.course_name,
          //     requiredModules: 0,
          //     completedModules: 0,
          //     progress: 0,
          //     userId: element.id,
          //     traineeName: element.name
          //   })
          // );
        });

        // make all the requests as a collection and wait for all responses as a whore response array

        forkJoin(requests).subscribe((responses: any) => {
          // iterate the result as a loop and update the students status
          responses.forEach((element: any) => {
            this.requestDetail.students[element.index].message = element.message; 

            if (element.status) {
              this.requestDetail.students[element.index].status = 'success'; 
              this.requestDetail.students[element.index].isEnrolling = false; 
      
            } else {
              this.requestDetail.students[element.index].status = 'failed'; 
              this.requestDetail.students[element.index].isEnrolling = false; 
      
              this.failedAttempts.push(this.requestDetail.students[element.index].name);
              this.remainingTrainees.push(this.requestDetail.students[element.index]);
            }
          });

          let payload:any = {
            id: this.requestDetail.id,
            students: JSON.stringify(Object.assign({}, this.requestDetail.students)),
          };
      
          !this.failedAttempts.length ? payload.status = 'Enrolled' : null;   
      
          this.service.mainCanvas(`updateEnrollmentRequest`, 'post', payload).subscribe((response: any) => {
            if (response.status) {
              this.toastr.success(response.message, 'Success');
    
              this.showEnrollSpinner = false;
        
              if(this.failedAttempts.length){
                
                this.failedAttemptsMessage.push(
                `${this.requestDetail.students - this.failedAttempts.length} 
                trainee's are Enrolled successfully. please try other trainee later. ${this.failedAttempts.toString().replace(',', ', ')}`);
    
              } else {
                this.showEnrollSpinner = false;
                this.requestDetail.status = 'Enrolled';
                this.toastr.success(`${this.requestDetail.students - this.failedAttempts.length} trainee's are Enrolled successfully`, 'Success');
        
              }
              
            } else {
              this.toastr.error(response.message, 'Error');
            }
          });

        });

        // forkJoin(enrollmentSideeffect).subscribe((responses: any) => {
        //   responses.forEach((element: any) => {
        //     if(!element.status){
        //       this.toastr.error(element.message,'Error');
        //     }
        //   });
        // });

      }

      })
      .catch(() => null);
    }

  }


  filterRequests($event: any){
    if($event.value){
      let payload = { 
        startDate: new Date($event.value[0] + 'UTC'), 
        endDate: new Date($event.value[1] + 'UTC'),
        institutionId: this.service.userData.id
      };
      
      this.isFiltering = true;
      
      this.service
      .mainCanvas(`filterEnrollmentRequest/${this.service.userData.id}`, 'post', payload)
      .subscribe((response: any) => {
        if (response.status) {
          this.requests = response.message;
          
        } else {
          this.toastr.error(response.message, 'Error');
        }
  
      });

    } else {
      if(this.isFiltering){
        this.loadRequest();
      }

    }
  
  }

  closeMessage(){
    this.failedAttemptsMessage = [];
  }

  checkRemainingTrainees(){
    this.remainingTrainees = [];
    this.enrolledTrainees = [];

    this.requestDetail.students.forEach((element: any) => {
      if((element.status == 'failed') || (element.status == 'pending')){
        this.remainingTrainees.push(element);

      } else {
        this.enrolledTrainees.push(element);
      }

    });

  }


}