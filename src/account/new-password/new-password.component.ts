import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';
import { CustomValidators } from '../signup/password-validators';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
})
export class NewPasswordComponent implements OnInit {
  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;
  public account_id: any;
  public login_id: any;
 
  public userid: any;

  constructor(
    public service: ApiService,
    private router: Router,
    public actRoute: ActivatedRoute,
    public toastr: ToastrService,
  ) {
    this.userid = this.actRoute.snapshot.paramMap.get('id');

    this.formGroup = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10),
        CustomValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
          requiresDigit: true,
        }),
        CustomValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
          requiresUppercase: true,
        }),
        CustomValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
          requiresLowercase: true,
        }),
        CustomValidators.patternValidator(new RegExp('(?=.*[$@^!%*?&])'), {
          requiresSpecialChars: true,
        })
      ]),
      repassword: new FormControl(null, Validators.required),
    },[CustomValidators.MatchValidator('password', 'repassword')]);
    
  }

  ngOnInit() {
    if(this.userid !== undefined){
      this.getUserLoginDetail();
    }
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  Submit() {
    this.formSubmitted = true;

    if (!this.formGroup.valid) {
      return;

    } else {
      this.disable = true;

      let payload = {
        login: { 
          password: this.getControls('password').value
        }
      };
      
      let url: any = `changePassword/${this.account_id}/${this.login_id}`;

      this.service.mainCanvas(url,'post',payload).subscribe((response: any) => {

        if (response.status) {
           this.toastr.success(response.message, 'Success');
           this.formGroup.reset();
           this.router.navigateByUrl('/');

        } else {
          this.toastr.error(response.message, 'Error');

        }

        this.disable = false;
      });
   
    }
  }


  getUserLoginDetail(){
    this.service.mainCanvas(`getUserLogin/${this.userid}`,'get',null).subscribe((response: any) => {
      if (response.status) {
         this.account_id = response.message.account_id;
         this.login_id = response.message.id;

      } else {
        this.toastr.error(response.message, 'Error');
      }
    });
  }



}
