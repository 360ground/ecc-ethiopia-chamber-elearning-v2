import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/service/api.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(public service: ApiService, public router: Router,
    public toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadSlideImages();
  }

  loadSlideImages(){
    this.service.mainCanvas('getSlidePhotos', 'get', null)
    .subscribe((response: any) => {
      if(response.status){
        this.service.slideImages = response.message;

      } else {
        this.toastr.error(response.message,'Error while loading slide images');

      }
    });
  }

}