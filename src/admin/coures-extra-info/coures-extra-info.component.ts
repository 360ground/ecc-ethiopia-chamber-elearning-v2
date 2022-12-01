import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-coures-extra-info',
  templateUrl: './coures-extra-info.component.html',
  styleUrls: ['./coures-extra-info.component.css']
})
export class CouresExtraInfoComponent implements OnInit {
  public fields: any = { text: 'name',value: 'id' };
  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;
  public isEditing: boolean = false;
  public showSpinner: boolean = false;

  public features: any[] = [];

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    ) { 
      this.formGroup = new FormGroup({
        id: new FormControl(null),
        courseId: new FormControl(null),
        info: new FormGroup({
          totalModules: new FormControl(null, Validators.required),
          estimatedCompletionHour: new FormControl(null, Validators.required),
          targetAudience: new FormControl(null, Validators.required),
          price: new FormControl(null, Validators.required),
        }),
        features: new FormControl(null, Validators.required)

      });
    }

  ngOnInit(): void {
  }


  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  loadData(event: any){
    this.service
    .mainCanvas(`getCourseExtraInfoDetail/${event.value}`, 'get', null)
    .subscribe(async (response: any) => {
      this.disable = false;
      if (response.status) {
        let message = response.message;

        if(message.length){
          this.isEditing = true;

          message.info = await JSON.parse(message.info);
          message.features = await JSON.parse(message.features);

          this.formGroup.patchValue(message);
        } 
        
      } else {
        this.toastr.info(`no data, 'Info'`);
      }
    });
  }

  addFeatures(){
    if(this.getControls('features').valid){
      this.features.push(this.getControls('features').value);
      this.getControls('features').reset();
    }
  }


  removeFeatues(feature: any, index: any){
    if(confirm(`are you sure want to remove ${feature} featue`)){
      this.features.splice(index,1);
    }
  }
 
  Submit() {
    this.formSubmitted = true;

    if (!this.formGroup.valid) {
      return;
      
    } else {

      if(this.features.length){
        this.disable = true;
        this.showSpinner = true;
  
      
        let payload = this.formGroup.value;
  
        payload.features = JSON.stringify(Object.assign({}, this.features));
        payload.info = JSON.stringify(payload.info);
  
        this.service
        .mainCanvas(this.isEditing ? 'updateEnrollmentRequest' :`createEnrollmentRequest`, 'post', payload)
        .subscribe((response: any) => {
          if (response.status) {
            this.disable = false;
            this.showSpinner = false;
            this.toastr.success(response.message, 'Success');
          } else {
            this.disable = false;
            this.showSpinner = false;
            this.toastr.error(response.message, 'Error');
  
          }
        });

      } else {
        this.toastr.error('Please add a features.', 'Error');
      }
    }


  }

}
