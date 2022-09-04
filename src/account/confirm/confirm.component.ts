import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  public isLoading: boolean = false;
  public confirmationErrors: any[] = [];
  public successData: any;
  public username: any;
  public secret: any;

  constructor(public service: ApiService, public router: Router,
     public actRoute: ActivatedRoute) {}

  ngOnInit() {
    this.secret = this.actRoute.snapshot.paramMap.get('secret');
    this.username = this.actRoute.snapshot.paramMap.get('username');

    this.confirmAccount();
  }

 
  confirmAccount() {
    this.isLoading = true;

    const formData = new FormData();

    formData.append('username', this.username);
    formData.append('secrate', this.secret);
    
    formData.append('service', 'moodle_mobile_app');
    formData.append('wsfunction', 'core_auth_confirm_user');
    formData.append('moodlewsrestformat', 'json');
                  
    this.service.main(formData).subscribe((response: any) => {
      if (!response.warnings.length) {
        this.confirmationErrors = [];
        this.router.navigateByUrl('/account/login');
      } else {
        this.confirmationErrors = [];
        this.confirmationErrors = response.warnings;
      }

      this.isLoading = false;
    });
         
  }
  
}
