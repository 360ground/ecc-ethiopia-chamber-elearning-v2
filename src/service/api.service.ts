import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { io } from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { Observable, forkJoin, of } from 'rxjs';

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
  public isAdmin: Boolean = false;
  public isAuthenticating: Boolean = false;
  public isLoggingout: Boolean = false;

  public MyCertificates: any[] = [];
  public enrollmentSideEffectData: any[] = [];

  public missingProfileFields: any[] = [];
  public missingProfileFieldsMessage: any[] = [];

  public slideImages: any[] = [];

  public currentUrl: any = null;

  public largeScreen: boolean = true;

  constructor(public http: HttpClient,public toastr: ToastrService) {}

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

  public getNewMessage = () => {
    return this.message$.asObservable();
  };

  getEnrolledCourses(userId: any) {
    let extractedCourses: any[] = [];
    let moduleRequests: any[] = []; 
    let sideEffectCourses: any[] = [];

    this
      .mainCanvas(`getUserEnrollment/${userId}`, 'get', {})
      .subscribe((enrollments: any[]) => {
        this
          .mainCanvas(`getAllEnrolledCourses/${userId}`, 'get', {})
          .subscribe(async(courses: any[]) => {
            enrollments.forEach((enrollment: any) => {
              moduleRequests.push(this.mainCanvas(`getAllModules/${enrollment.course_id}?studentId=${this.userData.id}`, 'get', {}));
              courses.forEach((course: any) => {
                if (
                  enrollment.course_id == course.id &&
                  enrollment.type == 'StudentEnrollment'
                  ) {
                    course.enrollment_id = enrollment.id;
                    extractedCourses.push(course);

                    sideEffectCourses.push({
                      courseId: enrollment.course_id,
                      courseTitle: course.name
                    });
                }
              });
            });

            await this.getTraineeAssessments(moduleRequests, sideEffectCourses);
            await this.separate(extractedCourses, userId);

          });
      });

  }

  getTraineeAssessments(requests: any, courses: any[]){
    let quizzes: any[] = [];

    forkJoin(requests).subscribe(async(responses: any) => {
      let index: number = 0;

      await responses.forEach((element: any) => {
        let course = courses[index];
      
        element.forEach((modules: any) => {

          modules.items.forEach((item:any) => {
            
            if(item.type == 'Quiz'){  
              if(!item.completion_requirement?.completed){
                quizzes.push(
                {
                  moduleName: modules.name,
                  assessmentName: item.title,
                  quizId: item.id,
                  courseId: course.courseId,
                  courseTitle: course.courseTitle,
                  userId: this.userData.id,
                  traineeName: this.userData.short_name,
                  traineeSex: this.userData.profile.sex,
                  traineeLocation: `${this.userData.profile.city}, ${this.userData.profile.country}`
                 }
                );
              }

            }
          });

        });

        index = index + 1;

      });

      console.log(quizzes)
    });

  }
  
  separate(data: any, userId: any) {
    let completed: any[] = [];
    let inprogress: any[] = [];
    let enrollmentRequestSideeffectRequests: any[] = [];


    this.mainCanvas(`getAllCertificates/${userId}`, 'get', {})
    .subscribe((response: any) => {

      this.MyCertificates = response.status ? response.message : []; 

      data.forEach((element: any, index: any) => {
        let progress = element.course_progress;

        if (location.protocol == 'http:'){
          element.image_download_url = element.image_download_url.replace('https', 'http');
        }
  
        if ('requirement_count' in progress) {
          element.percentage =
            (progress.requirement_completed_count / progress.requirement_count) *
            100;

          element.modules_published = true;

          // extract the enrollment side effect data

          if(progress.requirement_count !== progress.requirement_completed_count){
            let data = {
              requiredModules: progress.requirement_count,
              completedModules: progress.requirement_completed_count,
              progress: element.percentage,
              courseTitle: element.name,
              userId: this.userData.id,
              courseId: element.id,
              traineeName: this.userData.short_name,
              traineeSex: this.userData.profile.sex,
              traineeLocation: `${this.userData.profile.city}, ${this.userData.profile.country}`
            }
        
            enrollmentRequestSideeffectRequests.push(this.mainCanvas(`updateEnrollmentSideEffect`, 'post', data));

          }

          if (
            progress.requirement_count == progress.requirement_completed_count
          ) {
            
            let certificate = this.MyCertificates.find((certi: any)=> +certi.courseId == element.id);
            
            // if the certificate for the specified course is found
            if(certificate !== undefined){
  
              element.canGenerateCertificate = false;
              element.canViewCertificate = true;
              element.certificateId = certificate.id;
              element.isGeneratingCertificate = false;

              completed.push(element);

            } else {
            
                let payload = {
                  courseId: element.id,
                  courseCode: element.course_code,
                  courseName: element.name,
                  studentName: this.userData.short_name,
                  studentId: this.userData.id,
                  email: this.userData.email
                };
            
                this
                .mainCanvas(
                  `generateCertificate/`,
                  'post',
                  payload
                )
                .subscribe((response: any) => {
                  if (response.status) {
                    element.canViewCertificate = true;
                    element.canGenerateCertificate = false;
                    element.certificateId = response.message.id;
                    element.isGeneratingCertificate = false;

                  } else {
                    element.canGenerateCertificate = true;
                    element.canViewCertificate = false;
                    element.certificateId = null;
                    element.isGeneratingCertificate = false;
                  }

                  completed.push(element);
            
                });    
            }
      
          } else {
            element.canViewCertificate = true;
            inprogress.push(element);
  
          }
        } else {
          element.percentage = 0;
          element.modules_published = false;
          inprogress.push(element);
        }
      });

      // call update side effect update requests only if there is an updates.

      if(enrollmentRequestSideeffectRequests.length){
        this.updateEnrollmentSideeffect(enrollmentRequestSideeffectRequests) 
      }
    
    });

    this.myCourses.completed = completed;
    this.myCourses.inprogress = inprogress;
  }


  updateEnrollmentSideeffect(requests: any){
    forkJoin(requests).subscribe((responses: any) => {
      responses.forEach((element: any) => {
        if(!element.status){
          this.toastr.error(element.message,'Error');
        }
      });
    });

  }


}



     
