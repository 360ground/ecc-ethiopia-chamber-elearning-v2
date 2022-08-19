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
  public inprogress: any[] = [];
  public completed: any[] = [];

  public isLoading: Boolean = false;
  public adminToken: any = environment.adminToken;

  constructor(public service: ApiService, public router: Router) {}

  ngOnInit(): void {
    if (this.service.myCourses) {
      this.inprogress = this.service.myCourses.inprogress;
      this.completed = this.service.myCourses.completed;
    }
  }

  navigate(data: any) {
    this.router.navigate(['/learning'], { state: { course: data } });
  }
}
