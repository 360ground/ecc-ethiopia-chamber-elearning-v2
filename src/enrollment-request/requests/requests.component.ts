import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    this.requestDetail.students = Object.values(JSON.parse(this.requestDetail.students));

    this.index = index;
  }

  back(){
    this.requestDetail = null;
  }
  
  updateRequest(status: any){
    if(confirm(`are you sure want to ${status} this request ?`)){
      let payload = {
        id: this.requestDetail.id,
        status: status
      };
  
      this.service
        .mainCanvas(`updateEnrollmentRequest`, 'post', payload)
        .subscribe((response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success');
            this.requests[this.index].status = status;
  
          } else {
            this.toastr.error(response.message, 'Error');
  
          }
        });
    }

  }

}
