import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public variables = environment;
  public isSidnavShown: boolean = false;

  public logoUrl: any = environment.logoUrl;
  public usericonUrl: any = environment.usericonUrl;

  constructor(public service: ApiService, public router: Router, 
    private cookieService: CookieService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isLoggedIn();
  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
 }

  logout() {
    if (
      confirm(`${this.service.userData.name} are you sure want to logout ?`)
    ) {
      this.service
        .mainCanvas(`logout/${this.service.userData.id}/${this.service.token}`, 'delete', null)
        .subscribe((response: any) => {
          if (response.status) {
            this.service.userData = null;
            this.service.myCourses = null;
            this.service.token = null;
            localStorage.removeItem('access_token');
            this.router.navigateByUrl('/courses');
          } else {
            alert(response.message);
          }
        });
    }
  }

  navigate(url: any) {
    this.isSidnavShown = false;
    this.router.navigateByUrl(url);
  }

  isLoggedIn(){
    
    let access_token = this.cookieService.get('access_token');

    this.service
    .mainCanvas('isLoggedIn', 'post', {
      access_token: access_token !== "" ? access_token:  "nokey"
    })
    .subscribe((response: any) => {
      if(response.status){
        this.service.token = response.message.access_token;

        if (response.message.accountType == 'company') {
          this.service.isIndividual = false;
        }
  
        this.service.userData = response.message;
        this.service.getEnrolledCourses(response.message.id);
      }
    });
  }

}