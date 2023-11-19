import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
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

  doGoogleLogin() {

  }

  doRegister() {

  }
}
