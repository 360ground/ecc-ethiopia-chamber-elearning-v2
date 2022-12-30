import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  @ViewChild('content') content: any;

  public courses: any[] = [];
  public coursesBackup: any[] = [];

  public isLoading: Boolean = false;
  public courseCategories: any;
  public isLoadingCourseCategories: Boolean = false;
  public adminToken: any = environment.adminToken;
  public baseImageUrl: any = environment.baseUrlBackend;

  public searcNotFoundhMessage: any = null;
  public showSearch: boolean = true;

  public missingProfileFields:any [] = [];

  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;

  public paymentOptions: any[] = [
    { title: 'Free', id: 1, isChecked:false },
    { title: 'With payment', id: 0, isChecked:false },
  ];
  public certificationOptions: any[] = [
    { title: 'Have certificate', id: 1, isChecked:false },
    { title: 'Have not certificate', id: 0, isChecked:false },
  ];
  public courseLengthOptions: any[] = [
    { title: 'Under 2 hours', id: 'Under 2 hours', isChecked:false },
    { title: '2 - 10 hours', id: '2 - 10 hours', isChecked:false },
    { title: '11 - 20 hours', id: '11 - 20 hours', isChecked:false },
    { title: '+20 hours', id: '+20 hours', isChecked:false },
  ];
  public audienceOptions: any[] = [
    { title: 'Beginners', id: 'beginners', isChecked:false },
    { title: 'Intermediate', id: 'intermediate', isChecked:false },
    { title: 'Advanced', id: 'advanced', isChecked:false }
  ];

  public pageSize: any[] = [
    { text: '1 - 10', value: '10'},
    { text: '10 - 20', value: '20'},
    { text: '20 - 40', value: '40'},
    { text: '40 - 100', value: '100'},
    { text: 'More Than 100', value: 'all' }
  ];

  public fields: any = { text: 'text',value: 'value' };

  public filterOptions: any = {
    categoryId: [],
    courseFee: [],
    hasCertificate: [],
    targetAudience:[],
    estimatedCompletionHour:[]
  };

  public messages: any[] | undefined;

  @ViewChild('carousel', { static: true })
  carousel!: NgbCarousel;

	public paused = false;
	public unpauseOnArrow = false;
	public pauseOnIndicator = false;
	public pauseOnHover = true;
	public pauseOnFocus = true;
  public paymentId: any = undefined;
  public id: any = undefined;

  constructor(
    public service: ApiService,
    public router: Router,
    public toastr: ToastrService,
    public modalService: NgbModal,
    public actRoute: ActivatedRoute,
  ) {
    this.formGroup = new FormGroup({
      courseTitle: new FormControl(null, Validators.required),
    });

  }

  ngOnInit(): void {

    const queryParam:any = new URL(window.location.href).searchParams;

    if(queryParam !== undefined){
      
      if ('paymentId' in queryParam) {

        this.paymentId = queryParam.paymentId;
        
        if ('paymentCancel' in queryParam) {

          this.toastr.info('Payment canceld by User', 'Information');
          this.deletePaymentSideEffect();
        }

      }

      if ('id' in queryParam) {
        this.id = queryParam.id;
        
      }

    }


    if (this.service.loadedCourses) {
      this.courses = this.service.loadedCourses;
      
    } else {
      this.LoadCourses(10);
    }

    if(this.service.missingProfileFields.length){
      this.messages?.push(
        `Hello ${this.service.userData.name} , your profile seems to be not completed. 
         please complete the following fields. (${ this.service.missingProfileFields.toString() })`
      );
    }

    this.getCategories();

  }

  public LoadCourses(limit: any){
    this.isLoading = true;

    this.openModal();

    this.service
      .mainCanvas(`getAllCourseExtraInfo/${limit}`, 'get', null)
      .subscribe((response: any) => {
        if(response.status){
          let message = response.message;

          message.forEach((element: any) => {
            element.attributes = JSON.parse(element.attributes);
            element.features = Object.values(JSON.parse(element.features));


            if (location.protocol == 'http:'){

              if(element.attributes.image_download_url){
                element.attributes.image_download_url = element.attributes.image_download_url.replace('https', 'http');

              }

            }

            // request.push(this.service.mainCanvas(`getCourseExtraInfo/${element.id}`, 'get', null));
          }); 

          this.courses = message;
          this.service.loadedCourses = this.courses;

          this.isLoading = false;
          this.closeModal();
          
        } else {
          this.toastr.error(response.message, 'Error');
        }

        // this.loadExtraInfo(request);
    
      });
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  loadExtraInfo(request: any){
    forkJoin(request).subscribe(async(responses: any) => {
      let course: any;

      await responses.forEach((element: any) => {

        if(element.status){

          let message = element.message[0];

          if(message){
            message.attributes = JSON.parse(message.attributes);
            message.attributes.courseFee = +message.attributes.courseFee;
            message.features = Object.values(JSON.parse(message.features));
          }

          let index = this.courses.findIndex((course: any) => {
            return course.id == +message.courseId
          });

          this.courses[index].extraInfo = message;

          if(this.id == +message.courseId){
            course = { index: index, state: this.courses[index] };
          }

        }
      });

    

      if(this.id !== undefined){
        this.router.navigateByUrl(`detail/${this.id}/${course.index}?paymentId=${this.paymentId}`,
         { state: { course } })
      }


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

    this.service.mainCanvas(`category`, 'get', {}).subscribe((response: any) => {
      if (response.status) {
        this.courseCategories = response.message;

      } else {
        this.toastr.error(response.message, 'Error');

      }

      this.isLoadingCourseCategories = false;

    });

  }

  // on checkbox select
  setFilterOptions(isChecked: any, option: any, value: any, index: any, dataSource: any) {
    let _this: any = this;
    
    if (isChecked) {
      this.filterOptions[option].push(value);
      _this[dataSource][index].isChecked = true;

    } else {

      let ind = this.filterOptions[option].indexOf((element: any) => (element == value));

      this.filterOptions[option].splice(ind, 1);
      _this[dataSource][index].isChecked = false;

    }

  }

  searchCourses(){
    this.formSubmitted = true;

    if (!this.formGroup.valid) {
      return;

    } else {

      this.showSearch = false;

      let payload = this.formGroup.value;
      this.findCourses(false, payload);

    }

  }


  findCourses(isFiltering: boolean, payload: any){

    this.searcNotFoundhMessage = null;

    this.disable = true;
    this.formGroup.disable();
    this.openModal();
    
    this.service.mainCanvas(isFiltering ? `filterCourses` : 'searchCourses', 'post', payload).subscribe((response: any) => {
        if (response.status) {
          
          if(!response.message.length){

            this.searcNotFoundhMessage = 'No record found.';
            this.coursesBackup = [...this.courses];
            this.courses = response.message;

          } else {

            this.coursesBackup = [...this.courses];

            let message = response.message;

            message.forEach((element: any) => {
              element.attributes = JSON.parse(element.attributes);
              element.features = Object.values(JSON.parse(element.features));

              if (location.protocol == 'http:'){

                if(element.attributes.image_download_url){
                  element.attributes.image_download_url = element.attributes.image_download_url.replace('https', 'http');

                }

              }

            }); 

            this.courses = message;

            this.isLoading = false;
            this.closeModal();

          }

        } else {
          this.toastr.error(response.message, 'Error');
          
        }

        this.disable = false;
        this.formGroup.enable();
        this.closeModal();
      
      });

  }

  clearSearch(){
    this.courses = this.coursesBackup;
    this.searcNotFoundhMessage = null;
    this.showSearch = true;
    this.formSubmitted = false;
    
    this.formGroup.reset();
  }

  deletePaymentSideEffect(){
    this.service.mainCanvas(`deletePaymentSideeffect/${this.paymentId}`, 'delete', {})
    .subscribe((response: any) => {
      if (!response.status) {
        this.toastr.error(response.message, 'Error');
      }

    });  
  }

  clearFilterOptions(){
    if(confirm(`Are you sure want to clear filter ?`)){
      this.filterOptions = {
        categoryId: [],
        courseFee: [],
        hasCertificate: [],
        targetAudience:[],
        estimatedCompletionHour:[]
      };

      this.coursesBackup.length ? this.courses = this.coursesBackup : null;
      this.searcNotFoundhMessage = null;

      let _this: any = this;

      let Globalvariables = [
        'courseCategories','paymentOptions','certificationOptions','audienceOptions','courseLengthOptions'
      ];

      Globalvariables.forEach((element: any) => {
        _this[element].forEach((ele: any) => {
          ele.isChecked = false;
        });

      });

    }

  }

  public applyFilter(){
    this.findCourses(true, this.filterOptions)

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