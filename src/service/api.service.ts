import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public loadedCourses: any = null;
  public myCourses: any = {};

  public userData: any = null;
  public token: any = null;
  public courseCategories: any;

  constructor(public http: HttpClient) { }


  // login to the moodle site
  login(data: any) {
    return this.http.post(environment.loginUrl, data);
  }

  
  //this function is used to get reference number  for the payment
  getReferenceNumber(data: any) {
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${environment.medapayToken}`)
    }

    return this.http.post(environment.medapayUrl, data, header);
  }

  // this function is used for main request sending  for the rest of moodle
  main(data: any) {
    return this.http.post(environment.baseUrl, data);
  }


}
