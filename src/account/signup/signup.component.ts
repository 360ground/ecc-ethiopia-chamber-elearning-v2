import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

import jsonToFormData from '@ajoelp/json-to-formdata';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;
  public isIndividual: Boolean = true;
  public backendSignupError: any[] = [];
  public registrationSuccess: Boolean = false;

  constructor(
    private service: ApiService,
    private router: Router,
    public alertConfig: NgbAlertConfig
  ) {
    this.formGroup = new FormGroup({
      individual: new FormGroup({
        firstname: new FormControl(null, Validators.required),
        lastname: new FormControl(null, Validators.required),
        username: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phonenumber: new FormControl(null, Validators.required),
        accountType: new FormControl('individual'),
        password: new FormControl(null, [Validators.required]),
      }),
      company: new FormGroup({
        firstname: new FormControl(null, Validators.required),
        lastname: new FormControl(null, Validators.required),
        username: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phonenumber: new FormControl(null, Validators.required),
        password: new FormControl(null, [Validators.required]),
        organizationName: new FormControl(null, Validators.required),
        representativeFullName: new FormControl(null, Validators.required),
        representativeRole: new FormControl(null, Validators.required),
        sector: new FormControl(null, Validators.required),
        NoOfEmployee: new FormControl(null, Validators.required),
        isaMember: new FormControl(null),
        membershipType: new FormControl({ disabled: true, value: null }),
        memberId: new FormControl({ disabled: true, value: null }),
        accountType: new FormControl('company'),
      }),
    });
  }

  ngOnInit() {
    this.alertConfig.dismissible = false;
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

      // payload = jsonToFormData(payload);

      this.service
        .mainCanvas('register', 'post', payload)
        .subscribe((response: any) => {
          if (response.status) {
            // this.router.navigate(['/courses']);
            this.registrationSuccess = true;
            this.disable = false;
          } else {
            this.backendSignupError = [];
            this.backendSignupError = response.message;
            this.disable = false;
          }
        });
    }
  }

  changeType(isIndividualType: Boolean) {
    if (isIndividualType) {
      this.getControls('company').reset();
      this.isIndividual = true;
    } else {
      this.getControls('individual').reset();
      this.isIndividual = false;
    }
  }

  getPayload(name: any) {
    const formData = new FormData();

    // formData.append('wstoken', environment.adminToken);
    // formData.append('wsfunction', 'auth_email_signup_user');
    // formData.append('moodlewsrestformat', 'json');
    // // formData.append('redirect', environment.afterSignupRedirectUrl);
    // let keys = Object.keys(this.getControls(name).value);
    // let values = Object.values(this.getControls(name).value);
    // let outerIndex = 0;

    // let exclude = ['username', 'firstname', 'lastname', 'email', 'password'];

    // keys.forEach((element, index) => {
    //   if (exclude.includes(element)) {
    //     formData.append(element, String(values[index]));
    //   } else {
    //     if (values[index]) {
    //       formData.append(`customprofilefields[${outerIndex}][type]`, 'string');
    //       formData.append(
    //         `customprofilefields[${outerIndex}][name]`,
    //         `profile_field_${element}`
    //       );
    //       formData.append(
    //         `customprofilefields[${outerIndex}][value]`,
    //         String(values[index])
    //       );

    //       outerIndex++;
    //     }
    //   }
    // });

    // return formData;

    if (name == 'individual') {
      let payload = {
        user: {
          name:
            this.getControls(`${name}.firstname`).value +
            ' ' +
            this.getControls(`${name}.lastname`).value,
          short_name: this.getControls(`${name}.username`).value,
          sortable_name:
            this.getControls(`${name}.firstname`).value +
            ' ' +
            this.getControls(`${name}.lastname`).value,
          skip_registration: true,
        },
        pseudonym: {
          unique_id: this.getControls(`${name}.email`).value,
          password: this.getControls(`${name}.password`).value,
          send_confirmation: true,
        },
        communication_channel: {
          type: 'email',
          address: this.getControls(`${name}.email`).value,
          skip_confirmation: true,
        },
        custom_data: {
          data: {
            phonenumber: this.getControls(`${name}.phonenumber`).value,
            accountType: 'individual',
          },
        },
      };

      return payload;
    } else {
      let payload = {
        user: {
          name:
            this.getControls(`${name}.firstname`).value +
            ' ' +
            this.getControls(`${name}.lastname`).value,
          short_name: this.getControls(`${name}.username`).value,
          sortable_name:
            this.getControls(`${name}.firstname`).value +
            ' ' +
            this.getControls(`${name}.lastname`).value,
          skip_registration: true,
        },
        pseudonym: {
          unique_id: this.getControls(`${name}.email`).value,
          password: this.getControls(`${name}.password`).value,
          send_confirmation: true,
        },
        communication_channel: {
          type: 'email',
          address: this.getControls(`${name}.email`).value,
          skip_confirmation: true,
        },
        custom_data: {
          data: {
            phonenumber: this.getControls(`${name}.phonenumber`).value,
            organizationName: this.getControls(`${name}.organizationName`)
              .value,
            representativeFullName: this.getControls(
              `${name}.representativeFullName`
            ).value,
            representativeRole: this.getControls(`${name}.representativeRole`)
              .value,
            sector: this.getControls(`${name}.sector`).value,
            NoOfEmployee: this.getControls(`${name}.NoOfEmployee`).value,
            isaMember: this.getControls(`${name}.isaMember`).value,
            membershipType: this.getControls(`${name}.membershipType`).value,
            memberId: this.getControls(`${name}.memberId`).value,
            accountType: 'company',
          },
        },
      };

      return payload;
    }
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
