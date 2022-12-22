import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';
import { ConfirmationService } from 'src/shared/confirmation.service';

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.css']
})
export class MyRequestComponent implements OnInit {
  public myrequest: any[] = [];
  public teporaryMyRequest: any[] = [];
  public isFiltering: boolean = false;
  public isLoading: boolean = false;

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    public confirmation: ConfirmationService,
    ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(){
    this.isLoading = true;

    this.service
    .mainCanvas(`getMyEnrollmentRequest/${this.service.userData.id}`, 'get', null)
    .subscribe((response: any) => {
      if (response.status) {
        this.myrequest = response.message;
        
      } else {
        this.toastr.error(response.message, 'Error');
      }

      this.isLoading = false;

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
      this.confirmation.confirm('Confirmation', `Are you sure want to delete this request ?`,'Yes','No','lg')
      .then(async (confirmed) => {
       if(confirmed) {
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
    
      })
      .catch(() => null);
    }
  }

  filterRequests($event: any){
    
    if($event.value){
      let payload = { 
        startDate: new Date($event.value[0] + 'UTC'), 
        endDate: new Date($event.value[1] + 'UTC'),
        institutionId: this.service.userData.id 
      };

      this.isFiltering = true;
      
      this.service
      .mainCanvas(`filterEnrollmentRequest/${this.service.userData.id}`, 'post', payload)
      .subscribe((response: any) => {
        if (response.status) {
          this.myrequest = response.message;
          
        } else {
          this.toastr.error(response.message, 'Error');
        }
  
      });

    } else {
      if(this.isFiltering){
        this.loadRequests();
      }

    }
  
  }
}