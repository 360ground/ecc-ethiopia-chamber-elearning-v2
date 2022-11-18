import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.css']
})
export class MyRequestComponent implements OnInit {
  public myrequest: any[] = [];

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(){
    this.service
    .mainCanvas(`getMyEnrollmentRequest/${this.service.userData.id}`, 'get', null)
    .subscribe((response: any) => {
      if (response.status) {
        this.myrequest = response.message;
        
      } else {
        this.toastr.error(response.message, 'Error');
      }

    });
  }

  editRequest(request: any){
    this.router.navigate(['/enrollment/create'],{state: {
      enrollmentRequestDetail: request
    }})
  }

  navigate(){
    this.router.navigateByUrl('/enrollment/create');
  }

  deleteRequest(request: any, index: any){
    if(request.status !== 'pending'){
      this.toastr.error(`You can't delete while the request not in the pending state`, 'Error');

    } else {
      if(confirm(`are you sure want to delete this request ?`)){
  
         let payload = {id: request.id, url: `uploads/requests/${request.id}`};
  
        this.service
        .mainCanvas(`deleteEnrollmentRequest/${request.id}`, 'post', payload)
        .subscribe((response: any) => {
          if (response.status) {
            this.myrequest.splice(index,1);
            this.toastr.success(response.message, 'Success');
            
          } else {
            this.toastr.error(response.message, 'Error');
          }
    
        });
  
      }

    }
  }

}
