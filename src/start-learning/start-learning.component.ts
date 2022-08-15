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
    this.state = this.location.getState();

    this.isLoading = true;
    const formData = new FormData();

    this.startProgressbar(this.state.progress);

    formData.append('wstoken', this.service.token);
    formData.append('wsfunction', 'core_course_get_contents');
    formData.append('moodlewsrestformat', 'json');
    formData.append('courseid', this.state.id);

    this.service.main(formData).subscribe((response: any) => {
      this.courseDetail = response;
      this.isLoading = false;
    });
  }

  startProgressbar(value: any) {
    let scrollProgress: any = document.getElementById('progress');
    scrollProgress.style.background = `conic-gradient(#008fff ${31}%, #f2f2f4 ${31}%)`;
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.startProgressbar();
  // }
}
