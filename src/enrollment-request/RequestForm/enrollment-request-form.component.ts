import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/service/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enrollment-request-form',
  templateUrl: './enrollment-request-form.component.html',
  styleUrls: ['./enrollment-request-form.component.css'],
})
export class EnrollmentRequestFormComponent implements OnInit {
  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;
  public traineelist: any = null;
  public bankSlip: any = null;

  public students: any[] = [];
  public studentDetail: any = null;
  public isSearching: boolean = false;

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
  ) {
    this.formGroup = new FormGroup({
      institution_id: new FormControl(this.service.userData.id),
      institution_name: new FormControl(this.service.userData.profile.organizationName),
      course_id: new FormControl(null, Validators.required),
      course_name: new FormControl(null),
      traineelist: new FormControl(null, Validators.required),
      bankSlip: new FormControl(null, Validators.required),
      email: new FormControl(null,[Validators.required, Validators.email]),
      // date: new FormControl(null, Validators.required),
      remark: new FormControl(null),
      status: new FormControl('pending')
    });
  }

  ngOnInit() {}

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  public search(){    
      if(this.getControls('email').valid){
        this.isSearching = true;

        this.getControls('email').disable();
        this.studentDetail = null;
          
        let criteria: any = `sis_login_id:` + this.getControls('email').value;
    
        this.service
        .mainCanvas(`searchUser/${criteria}`, 'get', null)
        .subscribe((response: any) => {
          if (response.status) {
            this.studentDetail = response.message;

            this.disable = false;
    
          } else {
            this.toastr.info(`no trainee found by this email : ${this.getControls('email').value}`, 'Error');
            this.disable = false;
          }
          this.isSearching = false;
          this.getControls('email').enable();

        });

      }
  }

  public addStudent(student: any){
    let index = this.students.findIndex(x => x.email == this.getControls('email').value);
    
    let data = {
      name: student.short_name,
      email: student.email,
      id: student.id,
      avatar_url: student.avatar_url,
      status: 'pending',
      isEnrolling: false
    };

    if(index < 0){
      this.students.push(data);
      this.studentDetail = null;
      this.getControls('email').setValue(null);

    } else {
      let email = this.getControls('email').value;
      this.getControls('email').setValue(null);
      this.studentDetail = null

      this.toastr.info(`trainee already added by this email : ${email}`, 'Error');

    }

  }

  public removeStudent(index: any){
    if(confirm(`are you sure want to remove this student from the list ?`)){
      this.students.splice(index,1);
    }
  }

  public onFileUpload($event: any, isSlip: boolean) {
    let file = $event.target.files[0];

      const reader: any = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        if(isSlip) {
          this.bankSlip = reader.result.toString();

        } else {
          this.traineelist = reader.result.toString();
        }
      }; 
  }

  public removeAttatchment(isSlip: boolean) {
    if(confirm(`are you sure want to remove the ${ isSlip ? 'bank Slip' : 'trainee list' } attachment ?`)){
      isSlip ?  this.bankSlip = null : this.traineelist = null;
    }
  }

  Submit() {
    this.formSubmitted = true;

    this.getControls('email').clearValidators();
    this.getControls('email').updateValueAndValidity();

    if (!this.formGroup.valid) {
      return;
      
    } else {
      if(this.students.length){
        this.disable = true;
  
        let result = this.service.loadedCourses.find((element:any) => 
          element.id == this.getControls('course_id').value
        );
  
        this.getControls('course_name').setValue(result.name);
  
        let payload = this.formGroup.value;
  
        payload.traineelist = this.traineelist;
        payload.bankSlip = this.bankSlip;
        payload.students = JSON.stringify(Object.assign({}, this.students));
        delete payload.email;
  
        this.service
        .mainCanvas(`createEnrollmentRequest`, 'post', payload)
        .subscribe((response: any) => {
          if (response.status) {
            this.disable = false;
            this.toastr.success(response.message, 'Success');
            // navigate to the list
  
          } else {
            this.disable = false;
            this.toastr.error(response.message, 'Error');
  
          }
        });

      } else {
        this.toastr.error('Please add a students.', 'Error');
      }
    }
  }
}
