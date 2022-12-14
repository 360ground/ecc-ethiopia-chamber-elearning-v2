import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-trainee-performance-report',
  templateUrl: './trainee-performance-report.component.html',
  styleUrls: ['./trainee-performance-report.component.css']
})
export class TraineePerformanceReportComponent implements OnInit {
  public columes:any[] = [];
  public data: any;
  public isFiltering: boolean = false;
  public fields: any = { text: 'name',value: 'id' };

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
        field: 'traineeSex', headerText: 'Sex', width: '40'
      },
      {
        field: 'requiredModules', headerText: 'Required Modules', width: '60'
      },
      {
        field: 'completedModules', headerText: 'Completed Modules', width: '60'
      },
     
      {
        field: 'createdAt', headerText: 'Start Date', width: '90'
      },
      {
        field: 'updatedAt', headerText: 'Completion Date', width: '90'
      },
      {
        field: 'progress', headerText: 'Current Progress', width: '60'
      },
      {
        field: 'totalDaysTaken', headerText: 'Total days Taken for Completion', width: '60'
      }
    ]

  }

  filterDate(event:any){
    this.service
      .mainCanvas(`getAllTraineePerformanceReports/${event.itemData.id}`, 'get', {})
      .subscribe((response: any) => {
        if (response.status) {
          this.data = response.message;

        } else {
          this.toastr.error(response.message, 'Error');

        }
      });
  }

}
