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

}
