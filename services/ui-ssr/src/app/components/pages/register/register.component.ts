import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-register',
  standalone: true,
    imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTermsAndConditions: boolean = false;

  constructor(
      /*private cookiesNoticeService: CookiesNoticeService,
      private registerService: RegisterService,*/
      private authService: AuthService,
  ) {
  }

  ngOnInit() {
    // this.cookiesNoticeService.triggerIfNotAccepted();
  }

  doRegister() {
    /*this.registerService.doRegister(
        this.email,
        this.firstName,
        this.lastName,
        this.password,
        this.confirmPassword,
        this.acceptTermsAndConditions,
    );*/
  }

  doGoogleLogin() {
    this.authService.doGoogleLogin();
  }

}
