import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';
import { ConfirmationService } from 'src/shared/confirmation.service';

@Component({
  selector: 'app-coures-extra-info',
  templateUrl: './coures-extra-info.component.html',
  styleUrls: ['./coures-extra-info.component.css']
})
export class CouresExtraInfoComponent implements OnInit {
  public fields: any = { text: 'name',value: 'id' };
  public categoryFields: any = { text: 'category',value: 'id' };

  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;
  public disableDelete: boolean = false;

  public isEditing: boolean = false;

  public showSpinner: boolean = false;
  public showSpinnerDelete: boolean = false;

  public features: any[] = [];
  public categories: any[] = [];

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    public confirmation: ConfirmationService,
    ) { 
      this.formGroup = new FormGroup({
        id: new FormControl(null),
        courseId: new FormControl(null),
        attributes: new FormGroup({
          totalModules: new FormControl(null, Validators.required),
          estimatedCompletionHour: new FormControl(null, Validators.required),
          targetAudience: new FormControl(null, Validators.required),
          courseFee: new FormControl(null, Validators.required),
        }),
        features: new FormControl(null, Validators.required),
        category: new FormControl(null, Validators.required),
      });
    }

  ngOnInit(): void {
    this.loadCategory();
  }




  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  loadCategory(){
    this.service
    .mainCanvas(`category`, 'get', null)
    .subscribe((response: any) => {
      if(response.status){
        this.categories = response.message;

      } else {
        this.toastr.error(response.message, 'Error');

      }
    });
  }

  loadData(event: any){
    this.getControls('attributes').reset();
    this.features = [];
    this.formGroup.disable();
    this.disable = true;
    this.isEditing = false;

    this.service
    .mainCanvas(`getCourseExtraInfoDetail/${event.value}`, 'get', null)
    .subscribe((response: any) => {
      this.disable = false;
      if (response.status) {
        let message = response.message;

        if(message.length){
          this.isEditing = true;

          message[0].attributes = JSON.parse(message[0].attributes);
          message[0].features = Object.values(JSON.parse(message[0].features));

          this.getControls('attributes').patchValue(message[0].attributes);
          this.getControls('id').setValue(message[0].id);
          this.getControls('courseId').setValue(message[0].courseId);
          this.getControls('category').setValue(message[0].category);

          message[0].features.forEach((element: any) => {
            this.addFeatures(element);
          });

        } else {
          this.toastr.info(`No extra detail for this course`, 'Information');
        }
        
      } else {
        this.toastr.error(response.message, 'Error');
      }

      this.formGroup.enable();
      this.disable = false;
    });
  }

  addFeatures(value: any = null){
    if(value){
      this.features.push(value);

    } else {
      if(this.getControls('features').valid){
        this.features.push(this.getControls('features').value);
        this.getControls('features').reset();
      }
    }
  }

  removeFeatues(feature: any, index: any){
    if(confirm(`are you sure want to remove ${feature} featue`)){
      this.features.splice(index,1);
    }
  }
 
  Submit() {
    this.formSubmitted = true;

    this.getControls('features').clearValidators();
    this.getControls('features').updateValueAndValidity();

    if (!this.formGroup.valid) {
      return;
      
    } else {

      if(this.features.length){
        this.disable = true;
        this.showSpinner = true;
  
      
        let payload = this.formGroup.value;
  
        payload.features = JSON.stringify(Object.assign({}, this.features));
        payload.attributes = JSON.stringify(payload.attributes);
  
        this.service
        .mainCanvas(this.isEditing ? 'updateCourseExtraInfoDetail' :`createCourseExtraInfoDetail`, 'post', payload)
        .subscribe((response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success');

          } else {
            this.toastr.error(response.message, 'Error');
          }

          this.disable = false;
          this.showSpinner = false;

        });

      } else {
        this.toastr.error('Please add a course feature\'s.', 'Error');
      }
    }
  }

  Delete(){
    this.confirmation.confirm('Confirmation', `Are you sure want to delete ?`,'Yes','No','lg')
    .then(async (confirmed) => {
     if(confirmed) {
        this.disableDelete = true;
        this.showSpinnerDelete = true;
        this.disable = true;

        this.service
        .mainCanvas(`deleteCourseExtraInfoDetail/${this.getControls('id').value}`, 'delete', {})
        .subscribe((response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success');
            this.formGroup.reset();
            this.features = [];
            this.isEditing = false;

          } else {
            this.toastr.error(response.message, 'Error');
          }

          this.disableDelete = false;
          this.showSpinnerDelete = false;
          this.disable = false;

        });

     }

    })
    .catch(() => null);
  }


}
