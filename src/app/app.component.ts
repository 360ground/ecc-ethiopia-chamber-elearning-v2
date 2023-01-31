import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RoutesRecognized } from '@angular/router';
import { ApiService } from 'src/service/api.service';

import { ToastrService } from 'ngx-toastr';
import {filter, pairwise} from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(public service: ApiService, public router: Router,
    public toastr: ToastrService
    ,private breakpointObserver: BreakpointObserver,
    ) {
      this.router.events.pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
        .subscribe((event: any) => {
          localStorage.setItem('previousUrl', event[0].url)
          this.service.currentUrl = event[1].url;
        });

    // detect screen size changes
    this.breakpointObserver.observe([
      "(max-width: 768px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.service.largeScreen = false;  
      } else {
        this.service.largeScreen = true;  
      }
    });
  }

  ngOnInit(): void {
    this.loadSlideImages();
  }

  loadSlideImages(){
    this.service.mainCanvas(`getSlidePhotos/${true}`, 'get', null)
    .subscribe((response: any) => {
      if(response.status){
        this.service.slideImages = response.message;

      } else {
        this.toastr.error(response.message,'Error while loading slide images');

      }
    });
  }

}