import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  public detail: any;
  public state: any;
  public id: any;
  public paymentReferenceNumber: any;

  public disabled: Boolean = false;

  constructor(public service: ApiService, public actRoute: ActivatedRoute, public location: Location, public router: Router) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.paramMap.get('id');

    this.state = this.location.getState();

    // const formData = new FormData();

    // formData.append('wstoken', 'e466a3adcc463e1b0e7c5296288f6641')
    // formData.append('wsfunction', 'core_course_get_contents')
    // formData.append('moodlewsrestformat', 'json')
    // formData.append('courseid', this.id)

    // this.service.courseDetail(formData).subscribe((response: any) => {
    //   this.detail = response;
    // });

  }

  startLearning() {
    if (this.state?.customfields[0]?.valueraw) {
      // check the login status and call start enrolling
      if (confirm(`are you sure want to start learning ?`)) {
        this.enroll()
      }
    } else {
      // start calling the meda pay after confirmation
      if (confirm(`this course is costs you ${this.state?.customfields[1]?.valueraw} ETB. would you like to continue ?`)) {
        // start calling mega pay
        this.startPayment();

      }
    }
  }


  enroll() {

    const formData = new FormData();

    formData.append('wstoken', 'e466a3adcc463e1b0e7c5296288f6641')
    formData.append('wsfunction', 'enrol_manual_enrol_users')
    formData.append('moodlewsrestformat', 'json')
    formData.append('enrolments[]', '{}')

    this.service.courseDetail(formData).subscribe((response: any) => {
      console.log(response)
    });


  }

  startPayment() {
    this.disabled = true;

    if (!this.service.userData) {
      this.router.navigate(["/login"], { state: { returnUrl: `/detail/${this.id}`, course: this.state } });

    } else {

      let data = {
        "purchaseDetails": {
          "orderId": "Not Required",
          "description": `Payment For the course : ${this.state.fullname}`,
          "amount": +this.state.customfields[1].valueraw,
          "customerName": `${this.service.userData.fullname}`,
          "customerPhoneNumber": '0921622652'
        },
        "redirectUrls": {
          "returnUrl": "google.com",
          "cancelUrl": "google.com",
          "callbackUrl": "google.com"
        },
        "metaData": {
          "student name": `${this.service.userData.fullname}`,
          "course_name": `${this.state.fullname}`
        }
      }

      fetch(environment.medapayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${environment.medapayToken}`,
        },
        body: JSON.stringify(data),
        referrer: ""
      })
        .then((response) => response.json())
        .then((response) => {
          this.paymentReferenceNumber = response;

          if (response.status == 'created') {
            window.open(response.link.href, '_blank');

          } else {
            alert('unable to process the payment now.please try again later.');
            this.disabled = false;
          }

        })
        .catch((error) => {
          this.disabled = false;
        });
    }

  }

}
