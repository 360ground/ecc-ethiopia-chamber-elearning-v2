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

  constructor(
    public service: ApiService,
    public router: Router,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    if (this.service.loadedCourses) {
      this.courses = this.service.loadedCourses;
      
    } else {
      this.isLoading = true;

      this.openModal();

      this.service
        .mainCanvas('getAllCourses', 'get', null)
        .subscribe((response: any) => {
          this.courses = response;

          this.courses.forEach((element: any) => {
            element.image_download_url = element.image_download_url.replace('https', 'http');
          });  
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

  openModal() {
    const modalRef = this.modalService.open(NgbdModalContent);
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

  getCustomeFieldValue(customFields: any[], name: any) {
    let result = customFields.find((element) => element.shortname == name);

    if (result) {
      return result.value;
    } else {
      return 'N/A';
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
          Loading Courses <i class="fa fa-spinner" aria-hidden="true"></i>
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
