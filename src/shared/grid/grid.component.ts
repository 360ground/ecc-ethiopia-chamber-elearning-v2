import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {PageSettingsModel, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponents implements OnInit {
  @Input() data: any[] = [];
  @Input() columens: any[] = [];
  public toolbarOptions: ToolbarItems[] = [];

  public pageSettings: PageSettingsModel = {};
	public searchOptions: SearchSettingsModel | undefined;
  public toolbar: ToolbarItems[] = [];

  @ViewChild('grid') public grid: any;

  public pageSizes = ['5', '10', '20', '50', '100', '200', 'All'];

  constructor() { }

  ngOnInit(): void {
    
    // this.toolbarOptions = ['Search'];
    this.searchOptions = { operator: 'contains',key: '',ignoreCase: true};

		this.pageSettings = { pageSize: 5, pageSizes: this.pageSizes };

    this.toolbar.push('Search');
    this.toolbar.push('ExcelExport');
    this.toolbar.push('PdfExport');
  }

  toolbarClick(args: any): void {
    if (args.item.properties.prefixIcon == "e-excelexport") {
      this.grid.showSpinner();
      this.grid.excelExport();

    }
    if (args.item.properties.prefixIcon == "e-pdfexport") {
      this.grid.showSpinner();
      this.grid.pdfExport();      
    }
  }

  pdfExportComplete(): void {
    this.grid.hideSpinner();
  }

  excelExportComplete(): void {
    this.grid.hideSpinner();
  }



}