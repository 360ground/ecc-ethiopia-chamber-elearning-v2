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
  public files: any[] = [];
  public students: any[] = [];
  public studentDetail: any = null;

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService
  ) {
    this.formGroup = new FormGroup({
      institution_id: new FormControl(this.service.userData.id),
      institution_name: new FormControl(this.service.userData.name),
      course_id: new FormControl(null, [Validators.required]),
      course_name: new FormControl(null),

      date: new FormControl(null, Validators.required),
      remark: new FormControl(null),
      email: new FormControl(null),
      status: new FormControl('pending')
    });
  }

  ngOnInit() {}

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  public search(){
    let criteria: any = `sis_login_id:` + this.getControls('email').value;

    this.service
    .mainCanvas(`searchUser/${criteria}`, 'get', {})
    .subscribe((response: any) => {
      if (response.status) {
        this.studentDetail = response;
        this.disable = false;

      } else {
        this.studentDetail = null;
        this.disable = false;
      }
    });
  }

  public addStudent(data: any){
    this.students.push(data);
  }

  public removeStudent(index: any){
    if(confirm(`are you sure want to remove this student from the list ?`)){
      this.students.splice(index,1);
    }
  }

  public selectCourse(course:any){
    this.getControls('course_name').setValue(course.name);
  }

  public onFileUpload($event: any) {
    let files = $event.target.files;

    files.forEach((element:any) => {
      const reader: any = new FileReader();
      reader.readAsDataURL(element);
  
      reader.onload = () => {
        this.files.push(reader.result.toString());
      };
      
    });    
  }

  public removeAttatchment() {
    this.files = [];
  }

  Submit() {
    if (!this.formGroup.valid) {
      return;
      
    } else {
      this.disable = true;

      let payload = this.formGroup.value;
      payload.files = this.files;

      delete payload.email;

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
