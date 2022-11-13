import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

import jsonToFormData from '@ajoelp/json-to-formdata';
import { CustomValidators } from './password-validators';

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
  public payload = new FormData();

  public base64Image: any = null;

  constructor(
    private service: ApiService,
    private router: Router,
    public alertConfig: NgbAlertConfig
  ) {
    this.formGroup = new FormGroup({
      type: new FormControl(null, Validators.required),
      individual: new FormGroup({
        firstname: new FormControl(null, Validators.required),
        lastname: new FormControl(null, Validators.required),
        // username: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phonenumber: new FormControl(null, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          CustomValidators.patternValidator(new RegExp('^[09|^07]{2}'), {
            validMobileNumberFormat: true,
          }),
          CustomValidators.patternValidator(new RegExp('^[0-9]+$'), {
            MobileNumberMustBeNumber: true,
          }),
        ]),
        accountType: new FormControl('individual'),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(10),
          CustomValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
            requiresDigit: true,
          }),
          CustomValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
            requiresUppercase: true,
          }),
          CustomValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
            requiresLowercase: true,
          }),
          CustomValidators.patternValidator(new RegExp('(?=.*[$@^!%*?&])'), {
            requiresSpecialChars: true,
          }),
        ]),
      }),
      company: new FormGroup({
        firstname: new FormControl('', Validators.required),
        lastname: new FormControl('', Validators.required),
        // username: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phonenumber: new FormControl(null, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          CustomValidators.patternValidator(new RegExp('^[09|^07]{2}'), {
            validMobileNumberFormat: true,
          }),
          CustomValidators.patternValidator(new RegExp('^[0-9]+$'), {
            MobileNumberMustBeNumber: true,
          }),
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(10),
          CustomValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
            requiresDigit: true,
          }),
          CustomValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
            requiresUppercase: true,
          }),
          CustomValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
            requiresLowercase: true,
          }),
          CustomValidators.patternValidator(new RegExp('(?=.*[$@^!%*?&])'), {
            requiresSpecialChars: true,
          }),
        ]),
        organizationName: new FormControl(null, Validators.required),
        representativeFullName: new FormControl(
          { value: null, disabled: true },
          Validators.required
        ),
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

      this.service
        .mainCanvas('register', 'post', this.getPayload(name))
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

  onFileUpload($event: any) {
    if (!this.isIndividual) {
      let file = $event.target.files[0];

      const reader: any = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.base64Image = reader.result.toString();
      };
    }
  }

  changeType() {
    if (this.getControls('type').value == 'individual') {
      this.getControls('company').reset();
      this.isIndividual = true;
    } else {
      this.getControls('individual').reset();
      this.isIndividual = false;
    }
  }

  getPayload(name: any) {
    if (name == 'individual') {
      let payload = {
        user: {
          name:
            this.getControls(`${name}.firstname`).value +
            ' ' +
            this.getControls(`${name}.lastname`).value,
          short_name:
            this.getControls(`${name}.firstname`).value +
            ' ' +
            this.getControls(`${name}.lastname`).value,
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
          short_name:
            this.getControls(`${name}.firstname`).value +
            ' ' +
            this.getControls(`${name}.lastname`).value,
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
            accountType: 'company',
          },
        },
        memberId: this.base64Image,
      };

      return payload;
    }
  }

  isMemberCheck(value: any) {
    this.payload.delete('memberId');

    if (!value) {
      this.getControls('company.membershipType').reset();
      this.getControls('company.membershipType').disable();
      this.getControls('company.memberId').reset();
      this.getControls('company.memberId').disable();
    } else {
      this.getControls('company.membershipType').enable();
      this.getControls('company.memberId').enable();
    }
  }

  removeMemberId() {
    this.getControls('company.memberId').reset();
    this.base64Image = null;
  }
}
