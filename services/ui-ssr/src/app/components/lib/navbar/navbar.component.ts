import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {UserDto} from "../../../dtos/auth/UserDto";

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [CommonModule, NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean = false;
  userInfo: UserDto = AuthService.INITIAL_USER;

  constructor(private authService: AuthService) {
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

  doLogout() {
    this.authService.doLogout();
  }
}
