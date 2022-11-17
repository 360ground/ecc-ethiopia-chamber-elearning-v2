import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { concatMap, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

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


  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.service
      .mainCanvas(`getAllEnrollmentRequest`, 'get', {})
      .subscribe((response: any) => {
        if (response.status) {
          this.requests = response.message;

        } else {
          this.toastr.error(response.message, 'Error');

        }
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
    if(confirm(`are you sure want to ${status} this request ?`)){
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

  }

  openAttachment(attachment: any){
    let url = `${environment.baseUrlBackend}/uploads/requests/${this.requestDetail.id}`;

    if(attachment == 'bankSlip'){
      window.open(`${url}/bankSlip.jpeg`, '_blank');
      
    } else {
      window.open(`${url}/traineelist.jpeg`, '_blank');
    }
  }

  async enrollTrainee(){
    if(this.requestDetail.status !== 'Approved'){
      this.toastr.error('the request must be approved before enrolling the trainee`s','Error');

    } else {

      if(confirm(`are you sure want to enroll ${this.requestDetail.students.length} trainee's  ?`)){
        this.showEnrollSpinner = true;
  
        let data: any = {
          enrollment: {
            type: 'StudentEnrollment',
            enrollment_state: 'active',
            notify: true,
            self_enrolled: false,
          }
        };

        this.requestDetail.students.forEach(async (element:any, index: any) => {
          data.enrollment.user_id = element.id;
          
          this.requestDetail.students[index].isEnrolling = true; 

          this.service
            .mainCanvas(`selfEnroll/${this.requestDetail.course_id}`, 'post', data)
            .subscribe((response: any) => {
              if (response.status) {
                this.requestDetail.students[index].status = 'success'; 
                this.requestDetail.students[index].isEnrolling = false; 
      
              } else {
                this.requestDetail.students[index].status = 'failed'; 
                this.requestDetail.students[index].isEnrolling = false; 
      
                this.failedAttempts.push(element.name);
                this.remainingTrainees.push(element);
              }
      
            });
        });

        let payload:any = {
          id: this.requestDetail.id,
          students: JSON.stringify(Object.assign({}, this.requestDetail.students)),
        };
    
        !this.failedAttempts.length ? payload.status = 'Enrolled' : null;   
    
        this.service
          .mainCanvas(`updateEnrollmentRequest`, 'post', payload)
          .subscribe((response: any) => {
    
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
