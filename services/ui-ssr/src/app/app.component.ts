import {Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./components/lib/navbar/navbar.component";
import {CookiesNoticeModalComponent} from "./components/lib/modals/cookies-notice-modal/cookies-notice-modal.component";
import {DefaultModalComponent} from "./components/lib/modals/default-modal/default-modal.component";
import {PopupModalComponent} from "./components/lib/modals/popup-modal/popup-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, RouterOutlet, CookiesNoticeModalComponent, DefaultModalComponent, PopupModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Split';
}
