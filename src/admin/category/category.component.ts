import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  public fields: any = { text: 'name',value: 'id' };
  public formGroup: FormGroup;
  public formSubmitted = false;
  public disable: boolean = false;

  public isEditing: boolean = false;
  public currentEditingIndex: any = null;
  public showSpinner: boolean = false;

  public categories: any[] = [];

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    ) { 
      this.formGroup = new FormGroup({
        id: new FormControl(null),
        category: new FormControl(null,Validators.required)
      });
    }

  ngOnInit(): void {
    this.service
    .mainCanvas(`category/`, 'get', null)
    .subscribe((response: any) => {
      if (response.status) {
        this.categories = response.message; 
      } else {
        this.toastr.error(response.message, 'Error');
      }
    });
  }


  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  add(){
    this.categories.push(this.formGroup.value);
  }

  delete(cat: any, index: any){
    if(confirm(`Are you sure want to delete ${cat.category} category`)){
      this.service.mainCanvas(`category/${cat.id}`,'delete', {})
      .subscribe((response: any) => {
        if (response.status) {
          this.categories.splice(index,1);
          this.toastr.success(response.message, 'Success');

        } else {
          this.toastr.error(response.message, 'Error');
        }
      });
    }
  }
 
  edit(cat: any, index: any){
    this.formGroup.setValue(cat);
    this.isEditing = true;
    this.currentEditingIndex = index;
  }

  Submit() {
    this.formSubmitted = true;

    if (!this.formGroup.valid) {
      return;
      
    } else {

      this.disable = true;
      this.showSpinner = true;

      let payload = this.formGroup.value;

      this.service
      .mainCanvas((this.isEditing && this.formGroup.valid) ? 'category/update' :`category`, 'post', payload)
      .subscribe((response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success');
          if(this.isEditing){
            this.categories[this.currentEditingIndex] = this.formGroup.value;

          } else {
            this.categories.push(this.formGroup.value);

          }
          this.formGroup.reset();

        } else {
          this.toastr.error(response.message, 'Error');
        }

        this.disable = false;
        this.showSpinner = false;
        this.isEditing = false;
      });
    }

  }

  addNew(){
    this.isEditing = false;
    this.currentEditingIndex = null;
    this.formGroup.reset();
  }

}
