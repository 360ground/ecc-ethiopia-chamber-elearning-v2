import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-total-trainee-reports',
  templateUrl: './total-trainee-reports.component.html',
  styleUrls: ['./total-trainee-reports.component.css']
})
export class TotalTraineeReportsComponent implements OnInit {
  public columes:any[] = [];
  public data: any;
  public isFiltering: boolean = false;
  public fields: any = { text: 'name',value: 'id' };
  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService
  ) { 
  }


  ngOnInit(): void {
    this.columes = [
      {
        field: 'courseTitle', headerText: 'Course Title', width: '120'
      },
      {
        field: 'averageProgress', headerText: 'Average Progress', width: '120'
      },
      {
        field: 'averageAssessment', headerText: 'Average Assessment', width: '120'
      },
      {
        field: 'averageCompletionTime', headerText: 'Average Completion Time', width: '120'
      },
    ]
  }

  filterDate(event: any){  
    this.service
    .mainCanvas(`getAllTraineeAverageReports/${event.itemData.id}`, 'get', {})
    .subscribe((response: any) => {
      if (response.status) {
        this.data = response.message;

      } else {
        this.toastr.error(response.message, 'Error');

      }
    });
    
  }

}
