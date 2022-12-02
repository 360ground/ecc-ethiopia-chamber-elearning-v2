import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';
import { data } from '../../shared/grid/data';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  public columes:any[] = [];
  public data: any;
  public isFiltering: boolean = false;

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.columes = [
      {
        field: 'traineeName', headerText: 'Trainee Full name', width: '120'
      },
      {
        field: 'courseTitle', headerText: 'Course name', width: '120'
      },
      {
        field: 'courseCode', headerText: 'Course Code', width: '60'
      },
      {
        field: 'billReferenceNumber', headerText: 'Payment Ref.No', width: '90'
      },
      {
        field: 'paymentMethod', headerText: 'Payment Method', width: '60'
      },
      {
        field: 'status', headerText: 'Payment Status', width: '60'
      },
      {
        field: 'createdAt', headerText: 'Payment Date', width: '60', format: 'yMd',
      }
    ]

    this.loadRequest();
  }

  loadRequest(){
    this.service
      .mainCanvas(`getAllFinancialReports`, 'get', {})
      .subscribe((response: any) => {
        if (response.status) {
          this.data = response.message;

        } else {
          this.toastr.error(response.message, 'Error');

        }
      });
  }

  filterRequests($event: any){
    if($event.value){
      let payload = { 
        startDate: new Date($event.value[0] + 'UTC'), 
        endDate: new Date($event.value[1] + 'UTC'),
        // courseId: this.service.userData.id
      };
      
      this.isFiltering = true;
      
      this.service
      .mainCanvas(`filterFinancialReports`, 'post', payload)
      .subscribe((response: any) => {
        if (response.status) {
          this.data = response.message;
          
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

}
