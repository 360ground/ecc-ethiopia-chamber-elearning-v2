import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/service/api.service';
import { ConfirmationService } from 'src/shared/confirmation.service';

@Component({
  selector: 'app-image-manager',
  templateUrl: './image-manager.component.html',
  styleUrls: ['./image-manager.component.css']
})
export class ImageManagerComponent implements OnInit {
  @ViewChild('longContent') longContent: any;
  @ViewChild('previewContent') previewContent: any;

  public formGroup: FormGroup;
  public formSubmitted = false;

  public disable: boolean = false;
  public images: any[] = [];
  public selectedImages: any = [];
  public imagesBackup: any[] = [];

  public previewImage: any;
 
  public allowedExtenstion: any = '.jpeg,.jpg,.png,.webp';
  public baseImageUrl: any = environment.baseUrlBackend;

  public fields: any = { text: 'title',value: 'value' };

  public options: any[] = [
    { title: 'Yes', value: 1 },
    { title: 'No', value: 0 },
  ];

  public optionsSort: any[] = [
    { title: 'Latest', value: 'desc' },
    { title: 'Oldest', value: 'asc' },
  ];
  public SelectAllFlag: boolean = false;

  public isEditing: boolean = false;
  public fileUrl: any;

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    public confirmation: ConfirmationService,
    public modalService: NgbModal,
    public config: NgbModalConfig,
  ) { 

    this.formGroup = new FormGroup({
      id: new FormControl(null),
      image: new FormControl(null, Validators.required),
      title: new FormControl(null, [Validators.required,Validators.maxLength(255)]),
      description: new FormControl(null),
      showInSlide: new FormControl(1),
      filename: new FormControl(null)
    });

    this.config.backdrop = 'static';
		this.config.keyboard = false;

  }

  ngOnInit(): void {
    this.load_images();
  }

  public load_images(){
    this.service.mainCanvas(`getSlidePhotos/${false}`, 'get', null)
    .subscribe((response: any) => {
      if(response.status){
        this.images = response.message;
        this.imagesBackup = response.message;
      
      } else {
        this.toastr.error(response.message,'Error while loading slide images');

      }
    });
  }

  public getControls(name: any): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  public onFileUpload(event: any) {
    let file = event.filesData[0].rawFile;

    if(+event.filesData[0].statusCode){
      this.getControls('filename').setValue(event.filesData[0].type)
  
      const reader: any = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.getControls('image').setValue(reader.result.toString());
      };

    }
  }

  public onRemoveFile(){
    this.getControls('image').reset();
    this.getControls('filename').reset();
  }

  public deleteImages() {
    this.confirmation.confirm('Confirmation', `Are you sure want to Delete ${this.selectedImages.length} ?`,'Yes','No','lg')
    .then(async (confirmed) => {
     if(confirmed) {
      this.service
        .mainCanvas(`deleteImage`, 'post', { images : this.selectedImages })
        .subscribe((response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success');
            this.load_images();
            this.selectedImages = [];
            this.SelectAllFlag = false;

          } else {
            this.toastr.error(response.message, 'Error');

          }
        });
     }
    })
    .catch(() => null);
  }

  public submit(){
    this.formSubmitted = true;
    
    if(!this.formGroup.valid){
      return;
      
    } else {

      this.disable = true;
      let payload = this.formGroup.value;

      if(this.isEditing && this.getControls('image').value){
        payload.url = this.fileUrl;

      }

      this.formGroup.disable();

      this.service
      .mainCanvas(this.isEditing ? 'updateImage' : 'createImage', 'post', payload)
      .subscribe((response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success');
          this.formGroup.reset();
          this.closeModal();
          this.load_images();

        } else {
          this.toastr.error(response.message, 'Error');

        }

        this.formSubmitted = false;
        this.disable = false;
        this.formGroup.enable();
      });
      
    }

  }

  public viewDetail(value: any){
    this.previewImage = value;
    this.modalService.open(this.previewContent, { scrollable: true, size: 'lg' });

  }

  public selectImage(checked: Boolean, image: any){
    if(checked){
      this.selectedImages.push({ id: image.id, url: image.url });

    } else {

      let index = this.selectedImages.findIndex((element: any) => {
        return element.id == image.id;
      });

      this.selectedImages.splice(index,1);
    }
  }

  public addNew(){
    this.modalService.open(this.longContent, { scrollable: true, size: 'auto' });
    this.getControls('image').enable();
  }

  public closeModal(){    
    this.modalService.dismissAll();
    this.isEditing = false;
    this.formGroup.reset();
  }

  public selectAll(checked: boolean){
    this.selectedImages = [];
    
    if(checked){
      this.SelectAllFlag = true;

      this.images.forEach((element: any) => {
        this.selectedImages.push({ id: element.id, url: element.url })
      });

    } else {
      this.SelectAllFlag = false;

      this.selectedImages = [];
    }

  }

  public sort(event: any){
    this.service.mainCanvas('sortImage', 'post', { sortBy: event.itemData.value })
    .subscribe((response: any) => {
      if(response.status){
        this.images = response.message;
      
      } else {
        this.toastr.error(response.message,'Error while getting images');

      }
    });
  }

  public search(event: any){
    if(event.target.value !== ""){

      this.service.mainCanvas('searchImage', 'post', { title: event.target.value })
      .subscribe((response: any) => {
        if(response.status){
          this.images = response.message;

          if(!response.message.length){
            this.toastr.info('Nothing Found.','Information');
          }
        
        } else {
          this.toastr.error(response.message,'Error while getting images');
  
        }
      });

    } else {
      this.images = this.imagesBackup;

    }
  }

  public editImage(image: any){
    this.isEditing = true;

    this.formGroup.patchValue(image);
    this.modalService.open(this.longContent, { scrollable: true, size: 'lg' });

    this.getControls('image').clearValidators();
    this.getControls('image').updateValueAndValidity();


    this.fileUrl = image.url;

    

  }

}