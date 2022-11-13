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
  public emptyCertificateUrl: any = environment.emptyCertificateUrl;
  public certificateViewUrl:any = environment.baseUrlBackend;

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

          this.myCertification = response.message;

      } else {
        this.toastr.error(response.message, 'Error');

      }
    });

  }
  
  viewCertificate(id: any){
    window.open(`${this.certificateViewUrl}/viewCertificate/${id}`,'_blank');
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

          this.service.myCourses.completed.forEach((element:any, index:any) => {
            if(element.certificateId == id){
              this.service.myCourses.completed[index].canGenerateCertificate = true;
              this.service.myCourses.completed[index].canViewCertificate = false;
              this.service.myCourses.completed[index].certificateId = null;
              this.service.myCourses.completed[index].isGeneratingCertificate = false;

            }
          });
  
        } else {
          this.toastr.error(response.message, 'Error');
  
        }
      });
    }
  }

}
