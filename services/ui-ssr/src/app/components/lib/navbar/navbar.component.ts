import { Component } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [CommonModule, NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  doLogout() {
    return;
  }
}
