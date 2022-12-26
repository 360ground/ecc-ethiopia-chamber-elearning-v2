import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {PageSettingsModel, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponents implements OnInit,OnChanges {
  @Input() showSpinner: boolean = false;

  @Input() data: any[] = [];
  @Input() columens: any[] = [];
  public toolbarOptions: ToolbarItems[] = [];

  public pageSettings: PageSettingsModel = {};
	public searchOptions: SearchSettingsModel | undefined;
  public toolbar: ToolbarItems[] = [];

  @ViewChild('grid') public grid: any;

  public pageSizes = ['5', '10', '20', '50', '100', '200', 'All'];

  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
    
    // this.toolbarOptions = ['Search'];
    this.searchOptions = { operator: 'contains',key: '',ignoreCase: true};

		this.pageSettings = { pageSize: 5, pageSizes: this.pageSizes };

    this.toolbar.push('Search');
    this.toolbar.push('ExcelExport');
    this.toolbar.push('PdfExport');
    this.toolbar.push('ColumnChooser');

  }
  
  
  ngOnChanges(changes: SimpleChanges){
    if('showSpinner' in changes){
      if(changes['showSpinner'].currentValue){
        this.openModal();
      } else {
        this.closeModal();
      }
    }
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


  openModal() {    
    this.modalService.open(NgbdModalContent);
  }

  closeModal() {
    this.modalService.dismissAll();
  }



}
  @Component({
    selector: 'ngbd-modal-content',
    template: `
      <div class="modal-body">
        <div>
          <h2
            style="color: gray;font-weight: lighter; text-align: center; margin-top: 12px;"
          >
            Loading Datas <i class='fa fa-spinner fa-spin fa-3x fa-fw' 
            style="font-size: 24px !important"></i> 
          </h2>
        </div>
      </div>
    `,
  })
  
  export class NgbdModalContent {
    @Input() name: any;
  
    constructor(public activeModal: NgbActiveModal, config: NgbModalConfig) {
      config.backdrop = 'static';
      config.keyboard = false;
      config.centered = true;
      config.size = 'md';
    }



}