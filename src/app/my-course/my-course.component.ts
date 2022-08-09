import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.css']
})
export class MyCourseComponent implements OnInit {
  public courses: any[] = [];
  public isLoading: Boolean = false;

  constructor(public service: ApiService, public router: Router) { }

  ngOnInit(): void {
    if (this.service.myCourses) {
      this.courses = this.service.myCourses;

    } else {
      this.isLoading = true;
      const formData = new FormData();

      formData.append('wstoken', this.service.token)
      formData.append('wsfunction', 'core_enrol_get_users_courses')
      formData.append('moodlewsrestformat', 'json')
      formData.append('userid', this.service.userData.userid)


      this.service.getUserEnrolledCourses(formData).subscribe((response: any) => {
        this.courses = response;
        this.service.myCourses = this.courses;

        this.isLoading = false;
      });

    }


  }
}
