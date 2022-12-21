import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogueComponent } from './confirm-dialogue/confirm-dialogue.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: any,
    message: any,
    btnOkText: any = 'OK',
    btnCancelText: any = 'Cancel',
    dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmDialogueComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }


}
