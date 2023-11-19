import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {Router, RouterLink} from '@angular/router';
import {RoutePaths} from '../../../app.routes';
import {UserDto} from '../../../dtos/auth/UserDto';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatSlideToggleModule, RouterLink, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, AfterViewInit {
  isLoggedIn: boolean = false;
  userInfo: UserDto = AuthService.INITIAL_USER;
  isLoading: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.currentIsLoggedIn();
    this.authService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.userInfo = this.authService.currentUserInfo();
    this.authService.userInfo.subscribe((userInfo: UserDto) => {
      this.userInfo = userInfo;
    });
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }

  doLogout() {
    this.isLoading = true;
    this.router.navigate([`/${RoutePaths.LOGOUT_IN_PROCESS}`]).catch((reason: string) => window.alert(reason));
    setTimeout(() => {
      this.authService.doLogout();
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }, 1000);
  }
}
