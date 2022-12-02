import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public variables = environment;
  public isSidnavShown: boolean = false;

  public logoUrl: any = environment.logoUrl;
  public usericonUrl: any = environment.usericonUrl;
  public url: any = '';

  public currentUrl: any;

  @ViewChild('drawer') drawer: MatSidenav | undefined;

  constructor(public service: ApiService, public router: Router,
    public toastr: ToastrService,
    private cookieService: CookieService, 
    private cdr: ChangeDetectorRef) {
    
    }

  ngOnInit(): void {
    this.isLoggedIn();
  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
 }

  async logout() {
    if (
      confirm(`${this.service.userData.name} are you sure want to logout ?`)
    ) {
      this.service.isLoggingout = true;

      let id = this.service.userData.sis_user_id == 'admin' ? 'admin' :  this.service.userData.id;
      let UserId = await this.cookieService.get('UserId');
      
      this.service
        .mainCanvas(`logout/${id}/${UserId}`, 'delete', null)
        .subscribe((response: any) => {
          if (response.status) {
            this.service.userData = null;
            this.service.myCourses = null;
            this.service.token = null;
            this.cookieService.delete('access_token');
            this.service.isLoggingout = false;

            window.location.reload();

          } else {
            this.toastr.error(response.message, 'Error');
            this.service.isLoggingout = false;

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

  redirectToAdmin(){
    window.open(`${environment.canvasUrl}`, '_blank');
  }

  async isLoggedIn(){
    
    var userId = await this.cookieService.get('UserId');
    
    this.service
    .mainCanvas('isLoggedIn', 'post', {
      userId: userId !== "" ? userId:  "noUserId"
    })
    .subscribe((response: any) => {
      if(response.status){
        
        this.service.userData = response.message;

        this.service.token = response.message.access_token;

        if('profile' in response.message){
          if (response.message.profile.accountType == 'individual') {
            this.service.getEnrolledCourses(response.message.id);


            this.service.getEnrolledCourses(response.message.id);

            let missingProfileFields: any[] = [];
            let requiredFields = ['ageRange','organizationName','sector','occupation','country','city','yearOfExperience'];
            let availableFields = Object.keys(this.service.userData.profile);
    
            requiredFields.forEach(element => {
              if(!availableFields.includes(element)){
                missingProfileFields.push(element);
  
              }
            });

            if(missingProfileFields.length){
              let message = `Hello ${this.service.userData.name}, your profile seems to be not completed. 
                             please complete the following fields. (${missingProfileFields.toString().replace(',', ', ')})`;

              this.service.missingProfileFieldsMessage.push(message);

              this.toastr.info('please fill all the required fields.','Incomplete Profile');

              this.router.navigateByUrl('/account/profile');

            } else {
              this.router.navigateByUrl('/');

            }

          } else if(response.message.profile.accountType == 'company') {
              this.service.isIndividual = false;

              let missingProfileFields: any[] = [];
              let requiredFields = ['organizationName','representativeRole','sector','NoOfEmployee'];
              let availableFields = Object.keys(this.service.userData.profile);
      
              requiredFields.forEach(element => {
                if(!availableFields.includes(element)){
                  missingProfileFields.push(element);
                }
              });  

              if(missingProfileFields.length){
                let message = `Hello ${this.service.userData.name}, your profile seems to be not completed. 
                               please complete the following fields. (${missingProfileFields.toString().replace(',', ', ')})`;

                this.service.missingProfileFieldsMessage.push(message);

                this.toastr.info('please fill all the required fields.','Incomplete Profile');

                this.router.navigateByUrl('/account/profile');

              } else {
                this.router.navigateByUrl('/');

              }
          } 

        } else {
          this.service.isIndividual = false;
          this.service.isAdmin = true;
          this.router.navigateByUrl('/');
        }
      }
    });
  }

}
