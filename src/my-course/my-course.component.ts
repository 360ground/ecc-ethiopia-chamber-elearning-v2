import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.css'],
})
export class MyCourseComponent implements OnInit {
  public courses: any[] = [];
  public completed: any[] = [];

  public isLoading: Boolean = false;
  public adminToken: any = environment.adminToken;

  constructor(public service: ApiService, public router: Router) {}

  ngOnInit(): void {
    if (this.service.myCourses) {
      this.courses = this.service.myCourses;
    } else {
      this.isLoading = true;
      const formData = new FormData();

      formData.append('wstoken', this.service.token);
      formData.append('wsfunction', 'core_enrol_get_users_courses');
      formData.append('moodlewsrestformat', 'json');
      formData.append('userid', this.service.userData.userid);

      this.service.main(formData).subscribe((response: any) => {
        this.courses = response;
        this.service.myCourses = this.courses;
        this.separate(this.courses);
        this.isLoading = false;
      });
    }
  }

  separate(data: any) {
    data.forEach((element: any, index: any) => {
      if (element.completed) {
        this.completed.push(element);
        this.courses.splice(index, 1);
      }
    });
  }

  navigate(data: any) {
    this.router.navigate(['/learning'], { state: { course: data } });
  }
}
