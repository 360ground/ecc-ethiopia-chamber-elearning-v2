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

  public courseTitle: any;

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
        field: 'averageCompletionTime', headerText: 'Average Completion Days', width: '120'
      },
    ]
  }

  filterDate(event: any){  
    this.isFiltering = true;

    this.courseTitle = event.itemData.name;

    this.service
    .mainCanvas(`getAllTraineePerformanceReports/${event.itemData.id}`, 'get', {})
    .subscribe((upperResponse: any) => {
      if (upperResponse.status) {

        this.service.mainCanvas(`getEnrollmentsInCourse/${event.itemData.id}`, 'get', {}).subscribe((lowerResponse: any) => {
          if (lowerResponse.status) {

            let avarageProgress: number = 0;
            let avarageCompletionTime: number = 0;

            upperResponse.message.forEach((element: any) => {
              avarageProgress += Math.round((element.progress.requirement_completed_count / element.progress.requirement_count) * 100);
            });  

            avarageProgress = avarageProgress ? Math.round(avarageProgress/upperResponse.message.length) : 0;

            lowerResponse.message.forEach((element: any) => {
              let result = upperResponse.message.find((ele: any) => {
                return ele.id == element.user_id;
              })

              if(result){

                if(result.progress.completed_at){

                  var startDate: any = new Date(element.created_at);
                  var endDate: any = new Date(result.progress.completed_at);
    
                  avarageCompletionTime += (endDate - startDate) / (1000 * 60 * 60 * 24);
                }

              }

            });

            avarageCompletionTime = avarageCompletionTime ? Math.round(avarageCompletionTime/lowerResponse.message.length) : 0;

            this.data = [
              {
                averageProgress: avarageProgress,
                averageCompletionTime: avarageCompletionTime,
                courseTitle: this.courseTitle,
                averageAssessment: '-- not available --'
              }
            ];
        
            this.isFiltering = false;

          } else {
            this.toastr.error(lowerResponse.message, 'Error');
            this.isFiltering = false;

          }


        });  

      } else {
        this.toastr.error(upperResponse.message, 'Error');

      }

      this.isFiltering = false;

    });
    
  }

}
