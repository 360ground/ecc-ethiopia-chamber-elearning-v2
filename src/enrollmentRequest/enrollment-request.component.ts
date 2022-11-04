import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/service/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enrollment-request',
  templateUrl: './enrollment-request.component.html',
  styleUrls: ['./enrollment-request.component.css'],
})
export class EnrollmentRequestComponent implements OnInit {
  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;
  public traineelist: any[] = [];
  public bankSlip: any[] = [];

  public students: any[] = [];
  public studentDetail: any = null;
  public isSearching: boolean = false;

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService
  ) {
    this.formGroup = new FormGroup({
      institution_id: new FormControl(this.service.userData.id),
      institution_name: new FormControl(this.service.userData.name),
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

  public search($event:any){    
    if($event.key === "Enter") {
      
      if(this.getControls('email').valid){
        this.isSearching = true;

        this.getControls('email').disable();
        this.studentDetail = null;
  
        $event.preventDefault();
        
        let criteria: any = `sis_login_id:` + this.getControls('email').value;
    
        this.service
        .mainCanvas(`searchUser/${criteria}`, 'get', {})
        .subscribe((response: any) => {
          if (response.status) {
            this.studentDetail = response.message;
            this.disable = false;
    
          } else {
            alert(`no trainee found by this email : ${this.getControls('email').value}`)
            this.disable = false;
          }
          this.isSearching = false;
          this.getControls('email').enable();
        });

      }
    }

  }

  public addStudent(data: any){
  
    let index = this.students.findIndex(x => x.email == this.getControls('email').value);
    

    if(index < 0){
      this.students.push(data);
      this.studentDetail = null;
      this.getControls('email').setValue(null);

    } else {
      let email = this.getControls('email').value;
      this.getControls('email').setValue(null);
      this.studentDetail = null

      alert(`trainee already added by this email : ${email}`);
    }

  }

  public removeStudent(index: any){
    if(confirm(`are you sure want to remove this student from the list ?`)){
      this.students.splice(index,1);
    }
  }

  public selectCourse(course:any){
    this.getControls('course_name').setValue(course.name);
    this.getControls('course_id').setValue(course.id);
  }

  public onFileUpload($event: any, isSlip: boolean) {
    let file = $event.target.files[0];

      const reader: any = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        if(isSlip) {
          this.bankSlip.push(reader.result.toString());

        } else {
          this.traineelist.push(reader.result.toString());
        }
      }; 
  }

  public removeAttatchment(isSlip: boolean) {
    if(confirm(`are you sure want to remove the ${ isSlip ? 'bank Slip' : 'trainee list' } attachment ?`)){
      isSlip ?  this.bankSlip = [] : this.traineelist = [];
    }
  }

  Submit() {
    this.formSubmitted = true;
    this.getControls('email').clearValidators();
    
    console.log(this.formGroup.controls)

    if (!this.formGroup.valid) {
      return;
      
    } else {
      this.disable = true;
      let payload = this.formGroup.value;
      payload.traineelist = this.traineelist;
      payload.bankSlip = this.bankSlip;

      delete payload.email;

      console.log(payload);

      this.service
      .mainCanvas(`createEnrollmentRequest`, 'post', {})
      .subscribe((response: any) => {
        if (response.status) {
          this.disable = false;
          this.toastr.success(response.message, 'Success');

        } else {
          this.disable = false;
          this.toastr.error(response.message, 'Error');

        }
      });
    }
  }
}
