import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  public pages: any;
  public resources: any;

  constructor(
    public service: ApiService,
    public router: Router,
    public location: Location,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    let index = 1;
    this.state = this.location.getState();

    console.log(this.state);

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
      this.getPageContent();
      this.getResourceContent();
    });
  }

  getPageContent() {
    const formData = new FormData();

    formData.append('wstoken', environment.adminToken);
    formData.append('wsfunction', 'mod_page_get_pages_by_courses');
    formData.append('moodlewsrestformat', 'json');
    formData.append('courseids[0]', this.state.id);

    this.service.main(formData).subscribe((response: any) => {
      this.pages = response.pages;

      this.courseDetail.forEach((activity) => {
        activity.modules.forEach((topic: any, index: any) => {
          if (topic.modname == 'page') {
            let page = this.pages.find(
              (ele: any) => ele.coursemodule == topic.id
            );
            topic.htmlContent = page.content;
          }
        });
      });
    });
  }

  getResourceContent() {
    const formData = new FormData();

    formData.append('wstoken', environment.adminToken);
    formData.append('wsfunction', 'mod_resource_get_resources_by_courses');
    formData.append('moodlewsrestformat', 'json');
    formData.append('courseids[0]', this.state.id);

    this.service.main(formData).subscribe((response: any) => {
      this.resources = response.resources;

      this.courseDetail.forEach((activity) => {
        activity.modules.forEach((topic: any, index: any) => {
          if (topic.modname == 'resource') {
            let resource = this.resources.find(
              (ele: any) => ele.coursemodule == topic.id
            );
            topic.actualFileUrl = `${resource.contentfiles[0].fileurl}?token=${this.service.token}`;
          }
        });
      });

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
