import {afterRender, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {initModals} from 'flowbite';
import {ModalService} from '../../../../services/modal/modal.service';

@Component({
  selector: 'app-popup-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-modal.component.html',
  styleUrl: './popup-modal.component.css',
})
export class PopupModalComponent {
  modalPrompt: string = 'Prompt';
  modalConfirmButtonText: string = 'Confirm';
  modalCancelButtonText: string = 'Cancel';

  constructor(private modalService: ModalService, elementRef: ElementRef) {
    afterRender(() => {
      initModals();
      this.modalService.initPopupModal(elementRef);
    });
    this.modalService.getPopupModalAttributes().subscribe((popupModalAttributes) => {
      this.modalPrompt = popupModalAttributes.modalPrompt;
      this.modalConfirmButtonText = popupModalAttributes.modalConfirmButtonText;
      this.modalCancelButtonText = popupModalAttributes.modalCancelButtonText;
    });
    this.modalService.getPopupModalConfirmCallback().subscribe((confirmCallback) => {
      this.currentConfirmCallback = confirmCallback;
    });
    this.modalService.getPopupModalCancelCallback().subscribe((cancelCallback) => {
      this.currentCancelCallback = cancelCallback;
    });
  }

  currentConfirmCallback: Function = () => {
    return;
  };

  currentCancelCallback: Function = () => {
    return;
  };

  closePrompt() {
    this.modalService.hidePopupModal();
  }

  onConfirm() {
    this.modalService.hidePopupModal();
    this.currentConfirmCallback();
  }

  onCancel() {
    console.log('hiding popup modal');
    this.modalService.hidePopupModal();
    this.currentCancelCallback();
  }
}

