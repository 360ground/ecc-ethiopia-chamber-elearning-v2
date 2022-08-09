import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public service: ApiService, public router: Router) { }

  ngOnInit(): void {

  }

  logout() {
    if (confirm("are you sure want to logout from the system ?")) {
      this.service.userData = null;
      this.service.myCourses = null;
      this.service.token = null;

      this.router.navigateByUrl("/courses")

    }
  }

}
