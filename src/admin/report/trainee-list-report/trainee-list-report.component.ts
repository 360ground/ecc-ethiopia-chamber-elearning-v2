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
  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService
  ) { 
    this.formGroup = new FormGroup({
      courseId: new FormControl(null, Validators.required),
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
        field: 'createdAt', headerText: 'Start Date', width: '90'
      },
      {
        field: 'progress', headerText: 'Current Progress', width: '60'
      }
    ]
  }

  filterDate(){
    this.formSubmitted = true;

    if (!this.formGroup.valid) {
      return;

    } else {
      
      let payload = this.formGroup.value;

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
  
          } else {
            this.toastr.error(response.message, 'Error');
  
          }
      this.disable = false;
        });
    }

  }

}
