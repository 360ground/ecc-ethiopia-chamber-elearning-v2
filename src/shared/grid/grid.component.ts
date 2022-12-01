import { Component, Input, OnInit } from '@angular/core';
import {PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columens: any[] = [];
  public toolbarOptions: ToolbarItems[] = [];

  public pageSettings: PageSettingsModel = {};


  constructor() { }

  ngOnInit(): void {
    this.toolbarOptions = ['Search'];
    this.pageSettings = { pageSize: 5 };
  }

}
