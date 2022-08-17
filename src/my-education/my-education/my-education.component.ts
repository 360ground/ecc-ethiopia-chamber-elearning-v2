import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  public backEndError: any[] = [];
  public Success: Boolean = false;
  public educationalBackground: any[] = [];
  public isOnEdit: Boolean = false;
  public currentEditingEducationIndex: any;

  public qualification: any[] = [
    { value: 'training', title: 'training' },
    { value: 'certificate', title: 'certificate' },
    { value: 'training', title: 'training' },
    { value: 'BA', title: 'BA' },
    { value: 'MA', title: 'MA' },
    { value: 'Msc', title: 'Msc' },
    { value: 'Phd', title: 'Phd' },
  ];

  constructor(private service: ApiService, private router: Router) {
    this.formGroup = new FormGroup({
      institutionName: new FormControl(null, Validators.required),
      qualification: new FormControl(null, Validators.required),
      fieldOfStudy: new FormControl(null, Validators.required),
      dateOfCompletion: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    const element = this.service.userData.customfields.find(
      (element: any) => element.name == 'educationBackground'
    );

    this.educationalBackground = JSON.parse(element.value);
    console.log(this.educationalBackground);
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  Submit() {
    this.formSubmitted = true;
    if (!this.educationalBackground.length) {
      return;
    } else {
      this.disable = true;
      let payload = this.getPayload();

      this.service.main(payload).subscribe((response: any) => {
        this.backEndError = [];

        if (!response.warnings.length) {
          this.Success = true;
          this.backEndError = [];
        } else {
          this.backEndError = [];
          this.Success = false;
          this.backEndError = response.warnings;
        }

        this.disable = false;
      });
    }
  }

  getPayload() {
    const formData = new FormData();

    formData.append('wstoken', environment.adminToken);
    formData.append('wsfunction', 'core_user_update_users');
    formData.append('moodlewsrestformat', 'json');
    formData.append('users[0][id]', this.service.userData.id);

    formData.append(`users[0][customfields][0][type]`, 'educationBackground');
    formData.append(
      `users[0][customfields][0][value]`,
      JSON.stringify(this.educationalBackground)
    );

    return formData;
  }

  editEducation(index: any) {
    this.formGroup.setValue(this.educationalBackground[index]);
    this.isOnEdit = true;
    this.currentEditingEducationIndex = index;
  }

  addEducation() {
    this.educationalBackground.push(this.formGroup.value);
    this.formGroup.reset();
  }

  removeEducation(index: any) {
    if (confirm('are you sure want to remove this education ?')) {
      this.educationalBackground.splice(index, 1);
    }
  }

  updateEducation() {
    this.educationalBackground[this.currentEditingEducationIndex] =
      this.formGroup.value;
    this.isOnEdit = false;
    this.currentEditingEducationIndex = null;
    this.formGroup.reset();
  }
}
