import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public loadedCourses: any = null;
  public myCourses: any = {};

  public userData: any = null;
  public token: any = null;
  public courseCategories: any;

  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  public isIndividual: Boolean = true;
  public isAuthenticating: Boolean = false;


  constructor(public http: HttpClient) {}

  // login to the moodle site
  login(data: any) {
    return this.http.post(environment.loginUrl, data);
  }

  //this function is used to get reference number  for the payment
  getReferenceNumber(data: any) {
    let header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${environment.medapayToken}`
      ),
    };

    return this.http.post(environment.medapayUrl, data, header);
  }

  // this function is used for main request sending  for the rest of moodle
  main(data: any) {
    return this.http.post(environment.baseUrl, data);
  }

  mainCanvas(endpoint: any, method: any, data: any): any {
    if (method == 'get') {
      return this.http.get(`${environment.baseUrlBackend}/${endpoint}`);
    } else if (method == 'post') {
      return this.http.post(`${environment.baseUrlBackend}/${endpoint}`, data);
    } else if (method == 'delete') {
      return this.http.delete(`${environment.baseUrlBackend}/${endpoint}`);
    } else {
      console.log('lala');
    }
  }

  //socket io
  // socket = io('http://localhost:4000');

  public sendMessage(message: any) {
    // this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    // this.socket.on('message', (message) => {
    //   this.message$.next(message);
    // });

    return this.message$.asObservable();
  };

  getEnrolledCourses(userId: any) {
    let extractedCourses: any[] = [];

    this
      .mainCanvas(`getUserEnrollment/${userId}`, 'get', {})
      .subscribe((enrollments: any[]) => {
        this
          .mainCanvas(`getAllEnrolledCourses/${userId}`, 'get', {})
          .subscribe((courses: any[]) => {
            enrollments.forEach((enrollment: any) => {
              courses.forEach((course: any) => {
                if (
                  enrollment.course_id == course.id &&
                  enrollment.type == 'StudentEnrollment'
                ) {
                  course.enrollment_id = enrollment.id;
                  extractedCourses.push(course);
                }
              });
            });

            this.separate(extractedCourses);
          });
      });
  }

  separate(data: any) {
    let completed: any[] = [];
    let inprogress: any[] = [];

    data.forEach((element: any, index: any) => {
      let progress = element.course_progress;

      if ('requirement_count' in progress) {
        element.percentage =
          (progress.requirement_completed_count / progress.requirement_count) *
          100;
        element.modules_published = true;
        if (
          progress.requirement_count == progress.requirement_completed_count
        ) {
          element.canViewCertificate = true;
          completed.push(element);
        } else {
          element.canViewCertificate = false;
          inprogress.push(element);

        }
      } else {
        element.percentage = 0;
        element.modules_published = false;
        inprogress.push(element);
      }
    });

    this.myCourses.completed = completed;
    this.myCourses.inprogress = inprogress;
  }

}
