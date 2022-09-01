import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public isSidnavShown: boolean = false;

  public logoUrl: any = environment.logoUrl;
  constructor(public service: ApiService, public router: Router) {}

  ngOnInit(): void {
    this.service.sendMessage({ refNo: '001' });

    this.service.getNewMessage().subscribe((message: any) => {
      console.log(message);
    });
  }

  logout() {
    if (confirm('are you sure want to logout from the system ?')) {
      this.service.userData = null;
      this.service.myCourses = null;
      this.service.token = null;

      this.router.navigateByUrl('/courses');
    }
  }

  navigate(url: any) {
    this.isSidnavShown = false;
    this.router.navigateByUrl(url);
  }
}
