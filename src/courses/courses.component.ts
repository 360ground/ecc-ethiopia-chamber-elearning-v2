import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';

import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  @ViewChild('content') content: any;

  public courses: any[] = [];
  public isLoading: Boolean = false;
  public courseCategories: any;
  public isLoadingCourseCategories: Boolean = false;
  public adminToken: any = environment.adminToken;
  public baseImageUrl: any = environment.baseUrlBackend;

  public missingProfileFields:any [] = [];


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
  public messages: any[] | undefined;

  @ViewChild('carousel', { static: true })
  carousel!: NgbCarousel;


	public paused = false;
	public unpauseOnArrow = false;
	public pauseOnIndicator = false;
	public pauseOnHover = true;
	public pauseOnFocus = true;

  constructor(
    public service: ApiService,
    public router: Router,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    if (this.service.loadedCourses) {
      this.courses = this.service.loadedCourses;
      
    } else {
      this.isLoading = true;
      let request: any [] = [];

      this.openModal();

      this.service
        .mainCanvas('getAllCourses', 'get', null)
        .subscribe((response: any) => {
          this.courses = response;

          this.courses.forEach((element: any) => {
            if (location.protocol == 'http:'){
              if(element.image_download_url){
                element.image_download_url = element.image_download_url.replace('https', 'http');
              }
            }
            request.push(this.service.mainCanvas(`getCourseExtraInfo/${element.id}`, 'get', null));
          }); 

          this.loadExtraInfo(request);
          
          this.service.loadedCourses = this.courses;
          this.isLoading = false;
          this.closeModal();
        });
    }

    if(this.service.missingProfileFields.length){
      this.messages?.push(
        `Hello ${this.service.userData.name} , your profile seems to be not completed. 
         please complete the following fields. (${ this.service.missingProfileFields.toString() })`
      );
    }

  }

  loadExtraInfo(request: any){
    forkJoin(request).subscribe(async(responses: any) => {
      responses.forEach((element: any) => {
        let index = this.courses.findIndex((course: any) => {
          course.id = element.courseId
        });

        this.courses[index].extraInfo = element;
      });
    });
  }


  togglePaused() {
		if (this.paused) {
			this.carousel.cycle();
		} else {
			this.carousel.pause();
		}
		this.paused = !this.paused;
	}

	onSlide(slideEvent: NgbSlideEvent) {
		if (
			this.unpauseOnArrow &&
			slideEvent.paused &&
			(slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
		) {
			this.togglePaused();
		}
		if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
			this.togglePaused();
		}
	}

  openModal() {
    this.modalService.open(NgbdModalContent);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  closeMessage(){
    this.messages = [];
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



  

 

}

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-body">
      <div>
        <h2
          style="color: gray;font-weight: lighter; text-align: center; margin-top: 12px;"
        >
          Loading Courses <i class='fa fa-spinner fa-spin fa-3x fa-fw' 
          style="font-size: 24px !important"></i> 
        </h2>
      </div>
    </div>
  `,
})

export class NgbdModalContent {
  @Input() name: any;

  constructor(public activeModal: NgbActiveModal, config: NgbModalConfig) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.centered = true;
    config.size = 'md';
  }
}