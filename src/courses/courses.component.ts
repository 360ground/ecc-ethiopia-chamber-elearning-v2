import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  public courses: any[] = [];
  public isLoading: Boolean = false;
  public courseCategories: any;
  public isLoadingCourseCategories: Boolean = false;
  public paymentOptions: any[] = [
    { title: 'Free', id: 1 },
    { title: 'Not Free', id: 0 },
  ];
  public certificationOptions: any[] = [
    { title: 'Have certificate', id: 1 },
    { title: 'Have not certificate', id: 0 },
  ];
  public courseLengthOptions: any[] = [
    { title: 'Under 2 hours', id: 'under2hours' },
    { title: '2 - 10 hours', id: '2-10hours' },
    { title: '11 - 20 hours', id: '11-20hours' },
    { title: '+ 20 hours', id: '+20hours' },
  ];

  public selectedCategories: any[] = [];
  public selectedPayment: any[] = [];
  public selectedcertificate: any[] = [];
  public selectedCourseLength: any[] = [];

  constructor(public service: ApiService, public router: Router) {}

  ngOnInit(): void {
    if (this.service.loadedCourses) {
      this.courses = this.service.loadedCourses;
    } else {
      this.isLoading = true;
      const formData = new FormData();

      formData.append('wstoken', environment.adminToken);
      formData.append('wsfunction', 'core_course_get_courses_by_field');
      formData.append('moodlewsrestformat', 'json');

      this.service.main(formData).subscribe((response: any) => {
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

    formData.append('wstoken', environment.adminToken);
    formData.append('wsfunction', 'core_course_get_categories');
    formData.append('moodlewsrestformat', 'json');

    this.service.main(formData).subscribe((response: any) => {
      this.courseCategories = response;
      this.service.courseCategories = this.courseCategories;
      this.isLoadingCourseCategories = false;
    });
  }

  // on checkbox select
  setFilterCategories(isChecked: any, value: any) {
    if (isChecked) {
      this.selectedCategories.push(value);
    } else {
      let index = this.courseCategories.indexOf((ele: any) => (ele.id = value));
      this.selectedCategories.splice(index, 1);
    }
  }

  setFilterPayment(isChecked: any, value: any) {
    if (isChecked) {
      this.selectedPayment.push(value);
    } else {
      let index = this.paymentOptions.indexOf((ele: any) => (ele.id = value));
      this.selectedPayment.splice(index, 1);
    }
  }

  setFiltercertificate(isChecked: any, value: any) {
    if (isChecked) {
      this.selectedcertificate.push(value);
    } else {
      let index = this.certificationOptions.indexOf(
        (ele: any) => (ele.id = value)
      );
      this.selectedcertificate.splice(index, 1);
    }
  }

  setFilterCourseLength(isChecked: any, value: any) {
    if (isChecked) {
      this.selectedCourseLength.push(value);
    } else {
      let index = this.courseLengthOptions.indexOf(
        (ele: any) => (ele.id = value)
      );
      this.selectedCourseLength.splice(index, 1);
    }
  }
}
