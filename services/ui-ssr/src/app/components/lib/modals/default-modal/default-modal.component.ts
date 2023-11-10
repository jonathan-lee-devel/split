import {afterRender, Component, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {initModals} from 'flowbite';
import {ModalService} from '../../../../services/modal/modal.service';

@Component({
  selector: 'app-default-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default-modal.component.html',
  styleUrl: './default-modal.component.css',
})
export class DefaultModalComponent {
  modalHeading: string = 'Request Error';
  modalText: string = 'There was an error with the request';

  constructor(private modalService: ModalService, elementRef: ElementRef) {
    afterRender(() => {
      initModals();
      this.modalService.initDefaultModal(elementRef);
    });
    this.modalService.getModalAttributes().subscribe((modalAttributes) => {
      this.modalHeading = modalAttributes.heading;
      this.modalText = modalAttributes.text;
    });
  }
}
