import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  public courses: any[] = [];
  public isLoading: Boolean = false;
  public courseCategories: any;
  public isLoadingCourseCategories: Boolean = false;

  constructor(public service: ApiService, public router: Router) { }

  ngOnInit(): void {
    if (this.service.loadedCourses) {
      this.courses = this.service.loadedCourses;

    } else {
      this.isLoading = true;
      const formData = new FormData();

      formData.append('wstoken', 'e466a3adcc463e1b0e7c5296288f6641')
      formData.append('wsfunction', 'core_course_get_courses_by_field')
      formData.append('moodlewsrestformat', 'json')


      this.service.courses(formData).subscribe((response: any) => {
        this.courses = response.courses;
        this.courses.shift();
        this.service.loadedCourses = this.courses;

        this.isLoading = false;
      });

    }

    if (this.service.courseCategories) {
      this.courseCategories = this.service.courseCategories;

    } else {
      this.getCategories();
    }

  }

  getCategories() {
    this.isLoadingCourseCategories = true;

    const formData = new FormData();

    formData.append('wstoken', 'e466a3adcc463e1b0e7c5296288f6641')
    formData.append('wsfunction', 'core_course_get_categories')
    formData.append('moodlewsrestformat', 'json')


    this.service.courses(formData).subscribe((response: any) => {
      this.courseCategories = response;
      this.service.courseCategories = this.courseCategories;
      this.isLoadingCourseCategories = false;
    });
  }

}
