import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-my-education',
  templateUrl: './my-education.component.html',
  styleUrls: ['./my-education.component.css'],
})
export class MyEducationComponent implements OnInit {
  public formGroup: FormGroup;

  public formSubmitted = false;
  public disable: boolean = false;
  public myEducation: any[] = [];
  public isOnEdit: Boolean = false;
  public currentEditingEducationIndex: any;

  public qualification: any[] = [
    { value: 'training', title: 'training' },
    { value: 'certificate', title: 'certificate' },
    { value: 'training', title: 'training' },
    { value: 'diploma', title: 'Diploma' },
    { value: 'advancedDiploma', title: 'Advanced Diploma' },
    { value: 'BA', title: 'BA' },
    { value: 'Bsc', title: 'Bsc' },
    { value: 'MA', title: 'MA' },
    { value: 'Msc', title: 'Msc' },
    { value: 'Phd', title: 'Phd' },
  ];

  constructor(private service: ApiService, private router: Router,
        public toastr: ToastrService
    ) {
    this.formGroup = new FormGroup({
      institutionName: new FormControl(null, Validators.required),
      qualification: new FormControl(null, Validators.required),
      fieldOfStudy: new FormControl(null, Validators.required),
      dateOfCompletion: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.myEducation = this.service.userData.profile.myEducation ?
    Object.values(this.service.userData.profile.myEducation)
    : [];
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  Submit() {
    this.formSubmitted = true;

    if (!this.myEducation.length) {
      return;

    } else {
      this.disable = true;
      this.service.userData.profile.myEducation = Object.values(this.myEducation);

      let payload = {
        custom_data: { data: 
          this.service.userData.profile
         },
      };

      this.service
      .mainCanvas(
        `saveMyEducation/${this.service.userData.id}`,
        'post',
        payload
        ).subscribe((response: any) => {
          
        if (response.status) {
            this.toastr.success(response.message, 'Success');

        } else {
          this.toastr.error(response.message, 'Error');

        }

        this.disable = false;
      });
    }
  }

  editEducation(index: any) {
    this.formGroup.setValue(this.myEducation[index]);
    this.isOnEdit = true;
    this.currentEditingEducationIndex = index;
  }

  addEducation() {
    this.myEducation.push(this.formGroup.value);
    this.formGroup.reset();
  }

  removeEducation(index: any) {
    if (confirm('are you sure want to remove this education ?')) {
      this.myEducation.splice(index, 1);
    }
  }

  updateEducation() {
    this.myEducation[this.currentEditingEducationIndex] =
      this.formGroup.value;
    this.isOnEdit = false;
    this.currentEditingEducationIndex = null;
    this.formGroup.reset();
  }
}
