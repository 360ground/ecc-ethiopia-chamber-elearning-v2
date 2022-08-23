import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css'],
})
export class ModulesComponent implements OnInit {
  constructor(
    public location: Location,
    private sanitizer: DomSanitizer,
    public service: ApiService
  ) {}
  public detail: any;
  public currentItem: any = null;
  public currentItemIndex: any = 0;
  public isCanOpen: Boolean = false;

  ngOnInit(): void {
    this.detail = this.location.getState();
    this.detail = this.detail.data;
  }

  openUrl(index: any, data: any) {
    this.currentItem = null;
    this.currentItem = data;
    console.log(data);

    let modnames = ['page', 'url'];

    if (modnames.includes(data.modname)) {
      this.isCanOpen = true;
    } else {
      this.isCanOpen = false;
    }

    let url: any = data.url;
    // url = url.replace('?forcedownload=1', '');
    // url = `${url}&token=${this.service.token}`;
    // this.currentItem.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.currentItemIndex = index + 1;
  }
}
