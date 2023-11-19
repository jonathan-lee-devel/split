import {afterRender, AfterViewInit, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {UserDto} from '../../../dtos/auth/UserDto';
import {after} from 'node:test';
import {LoadingSpinnerComponent} from '../loading-spinner/loading-spinner.component';
import {RoutePaths} from "../../../app.routes";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgIf, RouterLink, LoadingSpinnerComponent],
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
    this.authService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.userInfo = this.authService.currentUserInfo();
    this.authService.userInfo.subscribe((userInfo) => {
      this.userInfo = userInfo;
    });
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }

  doLogout() {
    this.isLoading = true;
    this.router.navigate([`/${RoutePaths.LOGOUT_IN_PROCESS}`]).catch((reason) => window.alert(reason));
    setTimeout(() => {
      this.authService.doLogout();
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }, 1000);
  }
}
