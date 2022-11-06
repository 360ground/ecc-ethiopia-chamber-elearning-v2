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

  viewDetail(id: any){
    this.service
      .mainCanvas(`getDetailEnrollmentRequest/${id}`, 'get', {})
      .subscribe((response: any) => {
        if (response.status) {
          this.requestDetail = response.message;
          this.requestDetail.students = Object.values(JSON.parse(this.requestDetail.students))

        } else {
          this.toastr.error(response.message, 'Error');

        }
      });
  }

  back(){
    this.requestDetail = null;
  }
  
  updateRequest(status: any){
    let payload = {
      id: this.requestDetail.id,
      status: status
    };

    this.service
      .mainCanvas(`updateEnrollmentRequest`, 'post', payload)
      .subscribe((response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success');

        } else {
          this.toastr.error(response.message, 'Error');

        }
      });
  }

}
