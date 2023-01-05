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

  public fields: any = { text: 'text',value: 'value' };

  public pageSizes: any[] = [
    { text: '1 - 10', value: '10'},
    { text: '10 - 20', value: '20'},
    { text: '20 - 40', value: '40'},
    { text: '40 - 100', value: '100'},
    { text: 'More Than 100', value: 'all' }
  ];

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    public confirmation: ConfirmationService,
    ) { }

  ngOnInit(): void {
    this.loadRequests(10);
  }

  loadRequests(limit: any){
    this.isLoading = true;
    this.myrequest = [];

    this.service
    .mainCanvas(`getMyEnrollmentRequest/${this.service.userData.id}/${limit}`, 'get', null)
    .subscribe((response: any) => {
      if (response.status) {
        this.myrequest = response.message;
        this.isLoading = false;

      } else {
        this.toastr.error(response.message, 'Error');
        this.isLoading = false;

      }

    });
  }

  navigate(request: any){
    if(request){
      this.router.navigateByUrl(`/enrollment/edit/${request.id}`);

    } else {
      this.router.navigateByUrl('/enrollment/create');
    }
    
  }


  filterRequests($event: any){
    this.myrequest = [];

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
          this.isFiltering = false;

        } else {
          this.toastr.error(response.message, 'Error');
          this.isFiltering = false;

        }
  
      });

    } else {
      if(this.isFiltering){
        this.loadRequests(10);
      }

    }
  
  }
}