import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-trainee-list-report',
  templateUrl: './trainee-list-report.component.html',
  styleUrls: ['./trainee-list-report.component.css']
})
export class TraineeListReportComponent implements OnInit {
  public columes:any[] = [];
  public data: any;
  public isFiltering: boolean = false;
  public fields: any = { text: 'name',value: 'id' };
  public fieldsQuiz: any = { text: 'title',value: 'id' };

  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;

  public quizzes:any[] = [];

  public moduleName: any = null;

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService
  ) { 
    this.formGroup = new FormGroup({
      courseId: new FormControl(null, Validators.required),
      quizId: new FormControl(null, Validators.required),

      dateRange: new FormControl(null)
    })
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  ngOnInit(): void {
    this.columes = [ 
      {
        field: 'traineeName', headerText: 'Trainee Full name', width: '120'
      },
      {
        field: 'traineeSex', headerText: 'Sex', width: '40'
      },    
      {
        field: 'institution', headerText: 'Institution', width: '40'
      },
      {
        field: 'moduleName', headerText: 'Module', width: '90'
      },  
      {
        field: 'score', headerText: 'Result', width: '40'
      },
    ]
  }

  loadQuizzes(event: any){
    this.quizzes = [];
    this.getControls('quizId').disable();

    this.service
    .mainCanvas(`getAllModules/${event.value}`, 'get', {})
    .subscribe((response: any) => {
      if (response.status) {
        let modules  = response.message;

        modules.forEach((element: any) => {
          element.items.forEach((item:any) => {
            if(item.type == 'Quiz'){  
              this.quizzes.push({
                moduleName: element.name,
                title: item.title,
                id: item.content_id
              });  
            }
          });
        });

      } else {
        this.toastr.error(response.message, 'Error');

      }

      this.disable = false;
      this.getControls('quizId').enable();

    });
  }

  setModuleName(event:any){
    this.moduleName = event.itemData.moduleName;
  }

  filterDate(){
    this.formSubmitted = true;

    if (!this.formGroup.valid) {
      return;

    } else {
      
      let payload = this.formGroup.value;
      payload.moduleName = this.moduleName;

      if(payload.dateRange){
        payload.dateRange[0]  = new Date(payload.dateRange[0] + 'UTC'); 
        payload.dateRange[1]  = new Date(payload.dateRange[1] + 'UTC');
      }

      this.disable = true;
      
      this.service
        .mainCanvas(`getAllTraineeListReports`, 'post', payload)
        .subscribe((response: any) => {
          if (response.status) {
            this.data = response.message;

            console.log(response.message)
            this.disable = false;

          } else {
            this.toastr.error(response.message, 'Error');
            this.disable = false;
  
          }
          
        
        });
    }

  }

}