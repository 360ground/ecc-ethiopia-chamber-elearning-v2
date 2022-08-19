import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-start-learning',
  templateUrl: './start-learning.component.html',
  styleUrls: ['./start-learning.component.css'],
})
export class StartLearningComponent implements OnInit {
  public courseDetail: any[] = [];
  public isLoading: Boolean = false;
  public adminToken: any = environment.adminToken;
  public state: any = null;

  constructor(
    public service: ApiService,
    public router: Router,
    public location: Location
  ) {}

  ngOnInit(): void {
    let index = 1;
    this.state = this.location.getState();

    if ('activities' in this.state) {
      this.courseDetail = this.state.activities;
    } else {
      this.getDetailModules();
    }
  }

  getDetailModules() {
    this.isLoading = true;

    const formData = new FormData();

    formData.append('wstoken', environment.adminToken);
    formData.append('wsfunction', 'core_course_get_contents');
    formData.append('moodlewsrestformat', 'json');
    formData.append('courseid', this.state.id);

    this.service.main(formData).subscribe((response: any) => {
      this.courseDetail = response;
      this.isLoading = false;
    });
  }

  navigate(data: any, index: any) {
    data.fullname = this.state.fullname;
    data.totalModules = this.courseDetail.length;
    data.index = index;

    this.router.navigateByUrl('/learning/modules', {
      state: {
        data: data,
      },
    });
  }
}
