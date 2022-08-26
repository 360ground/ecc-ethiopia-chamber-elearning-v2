import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent implements OnInit {
  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;
  public isIndividual: Boolean = true;
  public profileUpdateError: any[] = [];
  public profileUpdateSuccess: Boolean = false;

  constructor(
    private service: ApiService,
    private router: Router,
    public alertConfig: NgbAlertConfig
  ) {
    this.isIndividual =
      this.service.userData.accountType == 'company' ? false : true;

    this.formGroup = new FormGroup({
      individual: new FormGroup({
        firstname: new FormControl(null, Validators.required),
        lastname: new FormControl(null, Validators.required),
        username: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phonenumber: new FormControl(null, Validators.required),
        // additional fields
        ageRange: new FormControl(null, Validators.required),
        organizationName: new FormControl(null, Validators.required),
        sector: new FormControl(null, Validators.required),
        occupation: new FormControl(null, Validators.required),
        country: new FormControl('Ethiopia', Validators.required),
        city: new FormControl(null, Validators.required),
        yearOfExperience: new FormControl(null, Validators.required),
        accountType: new FormControl(null),
      }),
      company: new FormGroup({
        firstname: new FormControl(null, Validators.required),
        lastname: new FormControl(null, Validators.required),
        username: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phonenumber: new FormControl(null, Validators.required),
        organizationName: new FormControl(null, Validators.required),
        representativeFullName: new FormControl(null, Validators.required),
        representativeRole: new FormControl(null, Validators.required),
        sector: new FormControl(null, Validators.required),
        NoOfEmployee: new FormControl(null, Validators.required),
        isaMember: new FormControl(null),
        membershipType: new FormControl({ disabled: true, value: null }),
        memberId: new FormControl({ disabled: true, value: null }),
        accountType: new FormControl(null),
      }),
    });
  }

  ngOnInit() {
    this.alertConfig.dismissible = true;

    this.getProfileDetail();
    this.isMemberCheck(false);
  }

  getProfileDetail() {
    let userData = this.service.userData;

    if (userData.accountType) {
      this.getControls(userData.accountType).enable();
      this.getControls(userData.accountType).patchValue(userData);

      let object: any = {};

      userData.customfields.forEach((element: any) => {
        if (element.type == 'checkbox') {
          element.value = +element.value;
        }

        object[element.name] = element.value;
      });
      this.getControls(userData.accountType).patchValue(object);
    }
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  Submit(name: any) {
    this.formSubmitted = true;
    if (!this.getControls(name).valid) {
      return;
    } else {
      this.disable = true;
      let payload = this.getPayload(name);

      this.service.main(payload).subscribe((response: any) => {
        this.profileUpdateError = [];

        if (!response.warnings.length) {
          this.profileUpdateSuccess = true;
          this.profileUpdateError = [];
        } else {
          this.profileUpdateError = [];
          this.profileUpdateSuccess = false;
          this.profileUpdateError = response.warnings;
        }

        this.disable = false;
      });
    }
  }

  getPayload(name: any) {
    const formData = new FormData();

    formData.append('wstoken', environment.adminToken);
    formData.append('wsfunction', 'core_user_update_users');
    formData.append('moodlewsrestformat', 'json');
    formData.append('users[0][id]', this.service.userData.id);

    let keys = Object.keys(this.getControls(name).value);
    let values = Object.values(this.getControls(name).value);
    let outerIndex = 0;

    let exclude = ['username', 'firstname', 'lastname', 'email'];

    keys.forEach((element, index) => {
      if (exclude.includes(element)) {
        formData.append(`users[0][${element}]`, String(values[index]));
      } else {
        if (values[index]) {
          formData.append(
            `users[0][customfields][${outerIndex}][type]`,
            `${element}`
          );
          formData.append(
            `users[0][customfields][${outerIndex}][value]`,
            element == 'isaMember'
              ? String(values[index] ? 1 : 0)
              : String(values[index])
          );
          outerIndex++;
        }
      }
    });

    return formData;
  }

  isMemberCheck(value: any) {
    if (!value) {
      this.getControls('company.membershipType').reset();
      this.getControls('company.membershipType').disable();
      this.getControls('company.memberId').disable();
    } else {
      this.getControls('company.membershipType').enable();
      this.getControls('company.memberId').enable();
    }
  }
}
