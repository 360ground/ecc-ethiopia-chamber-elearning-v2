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
  public data: any[] = [];
  public isFiltering: boolean = false;
  public fields: any = { text: 'name',value: 'id' };

  public currentCourse: any;

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.columes = [
      {
        field: 'courseTitle', headerText: 'Course Title', width: '80'
      },
      {
        field: 'traineeName', headerText: 'Trainee Full name', width: '80'
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

  async filterDate(event:any){
    this.currentCourse = event.itemData.name;

    this.data = [];
    this.isFiltering = true;

    this.service
      .mainCanvas(`getAllTraineePerformanceReports/${event.itemData.id}`, 'get', {})
      .subscribe((upperResponse: any) => {
        if (upperResponse.status) {

          this.service.mainCanvas(`getEnrollmentsInCourse/${event.itemData.id}`, 'get', {}).subscribe(async(lowerResponse: any) => {
            if (lowerResponse.status) {

              let data: any[] = [];
    
              upperResponse.message.forEach(async (element: any) => {

                let enrollment = lowerResponse.message.find((ele: any) => {
                  return ele.user_id == element.id;
                })

                var startDate: any = new Date(enrollment.created_at);
                var endDate: any = new Date(element.progress.completed_at);
                
                var diffDays: any = (endDate - startDate) / (1000 * 60 * 60 * 24);

                await data.push(
                  {
                    courseTitle: this.currentCourse,
                    traineeName: element.display_name,
                    traineeSex: element.pronouns ?? ' -- Not Specified by Trainee -- ',
                    requiredModules: element.progress.requirement_count,
                    createdAt: new Date(enrollment.created_at).toLocaleDateString("en-US"),
                    completedModules: element.progress.requirement_completed_count,
                    updatedAt: element.progress.completed_at ?  new Date(element.progress.completed_at).toLocaleDateString("en-US")  : ' -- Not completed -- ',
                    progress: Math.round((element.progress.requirement_completed_count / element.progress.requirement_count) * 100),
                    totalDaysTaken: element.progress.completed_at ? Math.round(diffDays) :  ' -- Not completed -- '
                  }
                )
              });
  
              this.data = data;
              
              this.isFiltering = await false;

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
