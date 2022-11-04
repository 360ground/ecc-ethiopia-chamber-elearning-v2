import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import { CustomValidators } from '../signup/password-validators';

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
  public base64Image: any = null;

  constructor(
    private service: ApiService,
    private router: Router,
    public toastr: ToastrService
  ) {
    this.isIndividual =
      this.service.userData.accountType == 'company' ? false : true;
      let names = this.service.userData.name.split(" ");

    this.formGroup = new FormGroup({
      individual: new FormGroup({
        firstname: new FormControl(names[0], Validators.required),
        lastname: new FormControl(names[1], Validators.required),
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
        firstname: new FormControl(names[0], Validators.required),
        lastname: new FormControl(names[1], Validators.required),
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
        organizationName: new FormControl(null, Validators.required),
        // representativeFullName: new FormControl(null, Validators.required),
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
    let userData = this.service.userData;

    this.getControls(userData.accountType).patchValue(userData);

    this.isMemberCheck(false);
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  Submit(name: any) {
    this.formSubmitted = true;

    if(!this.getControls(name).valid) {
      return;

    } else {
      this.disable = true;

      let payload = {
        custom_data: { data: this.getControls(name).value },
        memberId: this.base64Image
      };
      
      this.service
      .mainCanvas(
        `updateProfile/${this.service.userData.id}`,
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

  removeMemberId() {
    this.getControls('company.memberId').reset();
    this.base64Image = null;
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
