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
  public courses: any[] = [];

  public audience: any[] = [
    { name: 'Beginners', id: 'beginners' },
    { name: 'Intermediate', id: 'intermediate' },
    { name: 'Advanced', id: 'advanced' }
  ];

  public certification: any[] = [
    { name: 'Has Certification', id: 1 },
    { name: 'Has Not Certification', id: 0 }
  ];

  public courseLength: any[] = [
    { name: 'Under 2 hours', id: 'Under 2 hours' },
    { name: '2 - 10 hours', id: '2 - 10 hours' },
    { name: '11 - 20 hours', id: '11 - 20 hours' },
    { name: '+20 hours', id: '+20 hours' },
  ];
  
  public courseAttributes: any;

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    public confirmation: ConfirmationService,
    ) { 
      this.formGroup = new FormGroup({
        id: new FormControl(null),
        courseId: new FormControl(null),
        totalModules: new FormControl(null, Validators.required),
        estimatedCompletionHour: new FormControl(null, Validators.required),
        targetAudience: new FormControl(null, Validators.required),
        courseFee: new FormControl(null, Validators.required),
        hasCertificate: new FormControl(null, Validators.required),
        courseFeatures: new FormControl(null, Validators.required),
        categoryId: new FormControl(null, Validators.required),
      });
    }

  ngOnInit(): void {
    this.loadCategory();
    this.loadCourses();
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

  loadCourses(){
    this.service
    .mainCanvas(`getAllCourses`, 'get', null)
    .subscribe((response: any) => {
      this.courses = response;
    });
  }

  loadData(event: any){
    this.features = [];
    this.formGroup.disable();
    this.disable = true;
    this.isEditing = false;

    this.courseAttributes = {
      image_download_url: event.itemData.image_download_url,
      course_code: event.itemData.course_code,
      course_format: event.itemData.course_format,
      name:event.itemData.name,
      id: event.itemData.id,
      public_description: event.itemData.public_description
    };
    
    this.service
    .mainCanvas(`getCourseExtraInfoDetail/${event.itemData.id}`, 'get', null)
    .subscribe((response: any) => {
      this.disable = false;
      
      if (response.status) {
        let message = response.message;

        if(message.length){
          this.isEditing = true;

          message[0].features = Object.values(JSON.parse(message[0].features));

          this.formGroup.patchValue(message[0]);

          message[0].features.forEach((element: any) => {
            this.addFeatures(element);
          });

        } else {
          this.formGroup.reset();

          this.toastr.info(`No extra detail for this course`, 'Information');
        }
        
      } else {
        this.toastr.error(response.message, 'Error');
      }

      
      this.formGroup.enable();
      this.disable = false;
      
      this.getControls('courseId').setValue(this.courseAttributes.id);
    });
  }

  addFeatures(value: any = null){
    if(value){
      this.features.push(value);

    } else {
      if(this.getControls('courseFeatures').valid){
        this.features.push(this.getControls('courseFeatures').value);
        this.getControls('courseFeatures').reset();
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

    this.getControls('courseFeatures').clearValidators();
    this.getControls('courseFeatures').updateValueAndValidity();

    if (!this.formGroup.valid) {
      return;
      
    } else {

      if(this.features.length){
        this.disable = true;
        this.showSpinner = true;
  
        let payload = this.formGroup.value;
  
        payload.features = JSON.stringify(Object.assign({}, this.features));
        payload.courseTitle = this.courseAttributes.name;

        payload.attributes = JSON.stringify(this.courseAttributes);

        delete payload.courseFeatures;

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
