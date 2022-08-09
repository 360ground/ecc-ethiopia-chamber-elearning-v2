import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = environment.baseUrl;
  public loadedCourses: any = null;
  public myCourses: any = null;

  public userData: any = null;
  public token: any = null;
  courseCategories: any;

  constructor(public http: HttpClient) { }

  courses(data: any) {
    return this.http.post(environment.baseUrl, data);
  }

  courseDetail(data: any) {
    return this.http.post(environment.baseUrl, data);
  }

  login(data: any) {
    return this.http.post(environment.loginUrl, data);
  }

  getUserData(data: any) {
    return this.http.post(environment.baseUrl, data);
  }

  getUserEnrolledCourses(data: any) {
    return this.http.post(environment.baseUrl, data);
  }

  getUserCourseCategories(data: any) {
    return this.http.post(environment.baseUrl, data);
  }
  getReferenceNumber(data: any) {
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${environment.medapayToken}`)
    }

    return this.http.post(environment.medapayUrl, data, header);
  }


}
