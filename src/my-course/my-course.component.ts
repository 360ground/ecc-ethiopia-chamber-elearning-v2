import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.css'],
})
export class MyCourseComponent implements OnInit {
  public inprogress: any[] = [];
  public completed: any[] = []; 

  public certificateViewUrl:any = environment.baseUrlBackend;

  public isLoading: Boolean = false;
  public isGeneratingCertificate: boolean = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  public variables: any = environment;
  constructor(
    public service: ApiService,
    public router: Router,
    private _snackBar: MatSnackBar,
    public toastr: ToastrService

  ) {}

  openSnackBar(message: any, btnText: any) {
    this._snackBar.open(message, btnText, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  ngOnInit(): void {
  }

  navigate(data: any) {
    this.router.navigate(['/learning'], { state: { course: data } });
  }

  removeCourse(course: any, index: any, type: any) {
    if (
      confirm(`are you sure want to ${course.name} from your learning plan ?`)
    ) {
      this.service
        .mainCanvas(
          `selfUnEnroll/${course.id}/${course.enrollment_id}`,
          'delete',
          {}
        )
        .subscribe((response: any) => {
          if (response.status) {
            this.openSnackBar(response.message, 'Dismiss');

            if (type == 'inprogress') {
              this.service.myCourses.inprogress.splice(index, 1);
            } else {
              this.service.myCourses.completed.splice(index, 1);
            }
          } else {
            this.openSnackBar(response.message, 'Dismiss');
          }
        });
    }
  }


  GenerateCertificate(data: any, index: any){
    this.service.myCourses.completed[index].isGeneratingCertificate = true;

    let payload = {
      courseId: data.id,
      courseCode: data.course_code,
      courseName: data.name,
      studentName: this.service.userData.name,
      studentId: this.service.userData.id,
      email: this.service.userData.email
    };

    this.service
    .mainCanvas(
      `generateCertificate/`,
      'post',
      payload
    )
    .subscribe((response: any) => {
      if (response.status) {
        this.service.myCourses.completed[index].canViewCertificate = true;
        this.service.myCourses.completed[index].canGenerateCertificate = false;

        this.service.myCourses.completed[index].certificateId = response.message.id;
        this.toastr.success('Certificate generated successfully.', 'Success');

      } else {
        this.toastr.error(response.message, 'Error');
      }

      this.service.myCourses.completed[index].isGeneratingCertificate = false;
    });
  }

  viewCertificate(id: any){
    window.open(`${this.certificateViewUrl}/viewCertificate/${id}`,'_blank');
  }


}
