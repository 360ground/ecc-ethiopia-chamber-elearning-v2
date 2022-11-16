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
  public url: any = 'courses';

  @ViewChild('drawer') drawer: MatSidenav | undefined;

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
            this.cookieService.delete('access_token');
            
            window.location.reload();

          } else {
            alert(response.message);
          }
        });
    }
  }

  navigate(isSmallScreen: boolean = true, url: any) {
    this.isSidnavShown = false;
    this.url = url;
    this.router.navigateByUrl(url);

    if(isSmallScreen){
      this.drawer?.toggle();
    }
  }

  isLoggedIn(){
    
    let access_token = this.cookieService.get('access_token');

    this.service
    .mainCanvas('isLoggedIn', 'post', {
      access_token: access_token !== "" ? access_token:  "nokey"
    })
    .subscribe((response: any) => {
      if(response.status){
        
        this.service.userData = response.message;

        this.service.token = response.message.access_token;
        if (response.message.profile.accountType == 'individual') {
          this.service.getEnrolledCourses(response.message.id);
          
        } else if(response.message.profile.accountType == 'company') {
          this.service.isIndividual = false;

        }
  
      }
    });
  }

}