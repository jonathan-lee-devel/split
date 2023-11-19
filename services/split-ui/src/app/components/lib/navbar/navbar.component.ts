import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatSlideToggleModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public isDarkMode = true;

  onThemeSwitchChange() {
    this.isDarkMode = !this.isDarkMode;

    document.body.setAttribute('data-theme', (this.isDarkMode) ? 'light' : 'dark');
  }
}
