import {afterRender, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardWithIconComponent} from "../../lib/card-with-icon/card-with-icon.component";
import {LandingPageSplashTextComponent} from "../../lib/landing-page-splash-text/landing-page-splash-text.component";
import {CookiesNoticeService} from "../../../services/cookies-notice/cookies-notice.service";
import {Modal} from "flowbite";
import {ModalService} from "../../../services/modal/modal.service";

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, CardWithIconComponent, LandingPageSplashTextComponent, CardWithIconComponent],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements AfterViewInit {

    constructor(
        private changeDetector: ChangeDetectorRef,
        private cookiesNoticeService: CookiesNoticeService,
        private modalService: ModalService,
    ) {
        afterRender(() => {
            this.cookiesNoticeService.triggerIfNotAccepted();
        });
    }

    ngAfterViewInit() {
      /*this.modalService.showPopupModal(
          'Test Popup',
          'Confirm',
          'Cancel',
          () => {
            console.log('confirmed');
          },
          () => {
            console.log('canceled');
          }
      );*/
      this.changeDetector.detectChanges();
    }
}

