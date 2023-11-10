import {ElementRef, EventEmitter, Injectable, Output} from '@angular/core';
import {ModalAttributesDto} from "../../dtos/modals/ModalAttributesDto";
import {PopupModalAttributesDto} from "../../dtos/modals/PopupModalAttributesDto";
import {Observable} from "rxjs";
import {Modal, ModalInterface, ModalOptions} from "flowbite";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  @Output() modalAttributes: EventEmitter<ModalAttributesDto> = new EventEmitter<ModalAttributesDto>();
  @Output() popupModalAttributes: EventEmitter<PopupModalAttributesDto> = new EventEmitter<PopupModalAttributesDto>();

  @Output() popupModalConfirmCallback: EventEmitter<Function> = new EventEmitter<Function>();
  @Output() popupModalCancelCallback: EventEmitter<Function> = new EventEmitter<Function>();

  private $popupModal: HTMLElement | undefined;
  public popupModal: ModalInterface | undefined;
  private readonly popupModalOptions: ModalOptions = {placement: 'top-center', backdrop: 'dynamic', closable: true};

  private $cookiesNoticeModal: HTMLElement | undefined;
  public cookiesNoticeModal: ModalInterface | undefined;
  private readonly cookiesNoticeModalOptions: ModalOptions = {placement: 'top-center', backdrop: 'dynamic', closable: false};

  private $defaultModal: HTMLElement | undefined;
  public defaultModal: ModalInterface | undefined;
  private readonly defaultModalOptions: ModalOptions = {placement: 'top-center', backdrop: 'dynamic', closable: true};

  public showPopupModal(
      modalPrompt: string,
      modalConfirmButtonText: string,
      modalCancelButtonText: string,
      confirmCallback: Function,
      cancelCallback: Function) {
    this.popupModalAttributes.next({
      modalPrompt,
      modalConfirmButtonText,
      modalCancelButtonText,
    });
    this.popupModalConfirmCallback.next(confirmCallback);
    this.popupModalCancelCallback.next(cancelCallback);
    this.popupModal?.show();
  }

  public showCookiesNoticeModal() {
    this.cookiesNoticeModal?.show();
  }

  public showDefaultModal(modalHeading: string, modalText: string) {
    this.modalAttributes.next({
      heading: modalHeading,
      text: modalText,
    });
    this.defaultModal?.show();
  }

  getPopupModalConfirmCallback(): Observable<Function> {
    return this.popupModalConfirmCallback;
  }

  getPopupModalCancelCallback(): Observable<Function> {
    return this.popupModalCancelCallback;
  }

  getPopupModalAttributes(): Observable<PopupModalAttributesDto> {
    return this.popupModalAttributes;
  }

  getModalAttributes(): Observable<ModalAttributesDto> {
    return this.modalAttributes;
  }

  hidePopupModal() {
    this.popupModal?.hide();
  }

  public initPopupModal(elementRef: ElementRef): void {
    const popupModalElement = elementRef.nativeElement.querySelector('#popupModal');
    if (popupModalElement === null) {
      this.promptRefreshOnError();
      return;
    }
    this.$popupModal = popupModalElement;
    this.popupModal = new Modal(this.$popupModal, this.popupModalOptions);
  }

  public initCookiesNoticeModal(elementRef: ElementRef): void {
    const cookiesNoticeModalElement = elementRef.nativeElement.querySelector('#cookiesNoticeModal');
    if (cookiesNoticeModalElement === null) {
      this.promptRefreshOnError();
      return;
    }
    this.$cookiesNoticeModal = cookiesNoticeModalElement;
    this.cookiesNoticeModal = new Modal(this.$cookiesNoticeModal, this.cookiesNoticeModalOptions);
  }

  public initDefaultModal(elementRef: ElementRef): void {
    const defaultModalElement = elementRef.nativeElement.querySelector('#defaultModal');
    if (defaultModalElement === null) {
      this.promptRefreshOnError();
      return;
    }
    this.$defaultModal = defaultModalElement;
    this.defaultModal = new Modal(this.$defaultModal, this.defaultModalOptions);
  }

  private promptRefreshOnError(): void {
    window.alert('An error has occurred, please try refreshing the page');
  }
}
