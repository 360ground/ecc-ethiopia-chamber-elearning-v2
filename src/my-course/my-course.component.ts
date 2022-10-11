import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.css'],
})
export class MyCourseComponent implements OnInit {
  public inprogress: any[] = [];
  public completed: any[] = [];

  public isLoading: Boolean = false;
  public adminToken: any = environment.adminToken;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  public variables: any = environment;
  constructor(
    public service: ApiService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  openSnackBar(message: any, btnText: any) {
    this._snackBar.open(message, btnText, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  ngOnInit(): void {
    // if (this.service.myCourses) {
    //   this.inprogress = this.service.myCourses.inprogress;
    //   this.completed = this.service.myCourses.completed;
    // }
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
}
