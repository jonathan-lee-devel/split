import {Component, Signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {Router, RouterLink} from '@angular/router';
import {RoutePaths} from '../../../app.routes';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatSlideToggleModule, RouterLink, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLoggedIn: Signal<boolean> = this.authService.isLoggedIn.asReadonly();

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  doLogout() {
    this.router.navigate([`/${RoutePaths.LOGOUT_IN_PROCESS}`])
        .catch((reason: string) => window.alert(reason));
    setTimeout(() => {
      this.authService.doLogout();
    }, 1000);
  }
}
