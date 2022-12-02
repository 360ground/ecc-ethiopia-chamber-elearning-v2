import { Component, Input, OnInit } from '@angular/core';
import {PageSettingsModel, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
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
	public searchOptions: SearchSettingsModel | undefined;
  public toolbar: ToolbarItems[] = [];

  public pageSizes = ['5', '10', '20', '50', '100', '200', 'All'];

  constructor() { }

  ngOnInit(): void {
    
    // this.toolbarOptions = ['Search'];
    this.searchOptions = { operator: 'contains',key: '',ignoreCase: true};

		this.pageSettings = { pageSize: 5, pageSizes: this.pageSizes };

    this.toolbar.push('Search');

  }

}
