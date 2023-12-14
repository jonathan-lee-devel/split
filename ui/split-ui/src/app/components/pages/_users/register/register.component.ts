import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {first} from 'rxjs';

import {AuthService} from '../../../../services/auth/auth.service';
import {RegisterService} from '../../../../services/register/register.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTermsAndConditions: boolean = false;
  protected readonly first = first;

  constructor(
    private authService: AuthService,
    private registerService: RegisterService,
  ) {}

  doGoogleLogin() {
    this.authService.doGoogleLogin();
  }

  doRegister() {
    this.registerService.doRegister({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      confirmPassword: this.confirmPassword,
      acceptTermsAndConditions: this.acceptTermsAndConditions,
    });
  }
}
