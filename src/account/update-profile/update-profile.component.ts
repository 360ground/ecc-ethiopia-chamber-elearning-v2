import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import { CustomValidators } from '../signup/password-validators';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UpdateProfileComponent implements OnInit {
  public formGroup: FormGroup;

  public formSubmitted = false;
  public disable: boolean = false;
  public isIndividual: Boolean = true;
  public base64Image: any = null;

  public myEducation: any[] = [];
  public isOnEdit: Boolean = false;
  public currentEditingEducationIndex: any;
  public memberId: any = null;

  @ViewChild('longContent') longContent: any;


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


  constructor(
    private service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.isIndividual =
      this.service.userData.profile.accountType == 'company' ? false : true;
      let names = this.service.userData.short_name.split(" ");

    this.formGroup = new FormGroup({
      individual: new FormGroup({
        firstname: new FormControl(names[0], Validators.required),
        lastname: new FormControl(names[1], Validators.required),
        email: new FormControl(this.service.userData.email, [Validators.required, Validators.email]),
        phonenumber: new FormControl(this.service.userData.phonenumber, [
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
        accountType: new FormControl('individual'),
      }),
      company: new FormGroup({
        firstname: new FormControl(names[0], Validators.required),
        lastname: new FormControl(names[1], Validators.required),
        email: new FormControl(this.service.userData.email, [Validators.required, Validators.email]),
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
        accountType: new FormControl('company'),
      }),
      education: new FormGroup({
        institutionName: new FormControl(null, Validators.required),
        qualification: new FormControl(null, Validators.required),
        fieldOfStudy: new FormControl(null, Validators.required),
        dateOfCompletion: new FormControl(null, Validators.required),
      })
    });

  }

  ngOnInit() {
    let userData = this.service.userData;

    
    if(userData.profile.isaMember){
      userData.profile.isaMember = 1;

      this.getControls('company.memberId').enable();
      this.getControls('company.membershipType').enable();

      if(userData.profile.memberId){
        this.memberId = environment.baseUrlBackend + userData.profile.memberId;
      }

    } else {
      userData.profile.isaMember = 0;

    }

    this.getControls(userData.profile.accountType).patchValue(userData.profile);

    this.myEducation = this.service.userData.profile.myEducation ?
    Object.values(this.service.userData.profile.myEducation)
    : [];

    this.isMemberCheck(userData.profile.isaMember);
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

      let value = this.getControls(name).value;
      value.myEducation = Object.values(this.myEducation);

      let payload = {
        custom_data: { data: value },
        user_data: { 
          user : {
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
            email:  this.getControls(`${name}.email`).value
          }
        },

        memberId: this.base64Image
      };
      
      this.service
      .mainCanvas(
        `updateProfile/${this.service.userData.id}`,
        'post',
        payload
      ).subscribe((response: any) => {

        if (response.status) {
          this.service.userData.profile = value;
          this.toastr.success(response.message, 'Success');
          this.modalService.dismissAll();

        } else {
          this.toastr.error(response.message, 'Error');
          this.getControls('education').reset();
          this.modalService.dismissAll();

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


  saveChanges(){
    this.isOnEdit ? this.updateEducation() : this.addEducation();
  }

  editEducation(index: any) {
    this.getControls('education').setValue(this.myEducation[index]);
    this.isOnEdit = true;
    this.currentEditingEducationIndex = index;

    this.modalService.open(this.longContent, { scrollable: true, size: 'lg' });
  }

  addEducation() {
    this.myEducation.push(this.getControls('education').value);
    this.getControls('education').reset();
    this.modalService.dismissAll();

  }

  removeEducation(index: any) {
    if (confirm('are you sure want to remove this education ?')) {
      this.myEducation.splice(index, 1);
    }
  }

  updateEducation() {
    this.myEducation[this.currentEditingEducationIndex] =
      this.getControls('education').value;
    this.isOnEdit = false;
    this.currentEditingEducationIndex = null;
    this.getControls('education').reset();

    this.modalService.dismissAll();

  }


	openModal(longContent: any) {
		this.modalService.open(longContent, { scrollable: true, size: 'lg' });
	}


  openImage(){
    window.open(this.memberId, '_blank');
  }

  deleteMemberId(){
    if(confirm(`are you sure want to delete this file ?`)){
      this.disable = true;

      let payload = {
        url: this.service.userData.profile.memberId
      };
  
      this.service
        .mainCanvas(
          `deleteFiles`,
          'post',
          payload
        ).subscribe((response: any) => {
  
          if (response.status) {
            this.toastr.success(response.message, 'Success');
            this.memberId = null;
  
          } else {
            this.toastr.error(response.message, 'Error');
  
          }
  
          this.disable = false;
        });

    }
  }

}
