import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-my-certificate-list',
  templateUrl: './my-certificate-list.component.html',
  styleUrls: ['./my-certificate-list.component.css']
})
export class MyCertificateListComponent implements OnInit {
  public myCertification: any[] = [];
 

  constructor(private service: ApiService, private router: Router,
        public toastr: ToastrService
    ) {
   
  }

  ngOnInit() {
    this.service
    .mainCanvas(
      `getAllCertificates/${this.service.userData.id}`,
      'get',
      {}
      ).subscribe((response: any) => {
        
      if (response.status) {

          this.myCertification = response.myCertification;

      } else {
        this.toastr.error(response.message, 'Error');

      }
    });

  }
  
  viewCertificate(id: any){
    this.service
    .mainCanvas(
      `viewCertificate/${id}`,
      'get',
      {}
    )
    .subscribe((response: any) => {
      if (response.status) {
        window.open(environment.baseUrlBackend + response.message,"_blank");


      } else {
        this.toastr.error(response.message, 'Error');

      }
    });
  }

  deleteCertificate(id: any, index: any){
    if(confirm(`are you sure want to delete this certificate ?`)){
      this.service
      .mainCanvas(
        `deleteCertificate/${id}`,
        'delete',
        {}
      )
      .subscribe((response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success');
          this.myCertification.splice(index,1);
  
        } else {
          this.toastr.error(response.message, 'Error');
  
        }
      });
    }
  }

}
