import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public isSidnavShown: boolean = false;
  public url: any = '';

  @ViewChild('drawer') drawer: MatSidenav | any;

  
  constructor(
    public service: ApiService, public router: Router
  ) { }

  ngOnInit(): void {
  }

  navigate(isSmallScreen: boolean = true, url: any) {
    this.isSidnavShown = false;
    this.url = url;
    this.router.navigateByUrl(url);

    if(isSmallScreen){
      this.drawer?.toggle();
    }
  }

}
