import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(
    public service: ApiService,
    private router: Router,
    public toastr: ToastrService,
    public confirmation: ConfirmationService,
    public modalService: NgbModal,

  ) { 

    this.formGroup = new FormGroup({
      image: new FormControl(null, Validators.required),
      title: new FormControl(null, [Validators.required,Validators.maxLength(255)]),
      description: new FormControl(null),
      showInSlide: new FormControl(null)
    });

  }

  ngOnInit(): void {
    this.load_images();
  }

  public load_images(){
    this.service.mainCanvas('getSlidePhotos', 'get', null)
    .subscribe((response: any) => {
      if(response.status){
        this.images = response.message;
      
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

    const reader: any = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.getControls('image').setValue(reader.result.toString())
    }; 

  }

  public deleteImages() {
    this.confirmation.confirm('Confirmation', `${this.service.userData.name} Are you sure want to Delete ${this.selectedImages.length} ?`,'Yes','No','lg')
    .then(async (confirmed) => {
     if(confirmed) {
      this.service.isLoggingout = true;
      
      this.service
        .mainCanvas(`deleteImage`, 'post', { ids : this.selectedImages })
        .subscribe((response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success');

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
      this.service
      .mainCanvas('createImage', 'post', this.formGroup.value)
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

      });
      
    }
  }


  public viewDetail(value: any){
    this.previewImage = value;
    this.modalService.open(this.previewContent, { scrollable: true, size: 'lg' });

  }

  public selectImage(checked: Boolean, image: any){
    if(checked){
      this.selectedImages.push(image);

    } else {
      let index = this.selectedImages.indexOf(image);

      this.selectedImages.splice(index,1);
    

    }
  }

  public addNew(){
    this.modalService.open(this.longContent, { scrollable: true, size: 'lg' });

  }

  public closeModal(){
    this.modalService.dismissAll();

  }

  public selectAll(checked: boolean){
    this.selectedImages = [];
    
    if(checked){
      this.SelectAllFlag = true;

      this.images.forEach((element: any) => {
        this.selectedImages.push(element.id)
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
      this.toastr.info('Please enter something','Information');

    }
  }

}