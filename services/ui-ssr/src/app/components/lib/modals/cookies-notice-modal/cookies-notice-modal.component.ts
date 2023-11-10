import {afterRender, Component, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {initModals} from 'flowbite';
import {CookiesNoticeService} from '../../../../services/cookies-notice/cookies-notice.service';
import {ModalService} from '../../../../services/modal/modal.service';

@Component({
  selector: 'app-cookies-notice-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookies-notice-modal.component.html',
  styleUrl: './cookies-notice-modal.component.css',
})
export class CookiesNoticeModalComponent {
  constructor(
      private cookiesNoticeService: CookiesNoticeService,
      private modalService: ModalService,
      elementRef: ElementRef,
  ) {
    afterRender(() => {
      initModals();
      this.modalService.initCookiesNoticeModal(elementRef);
    });
  }

  doAccept() {
    this.cookiesNoticeService.doAccept();
  }
}
