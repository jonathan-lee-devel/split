import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {PasswordService} from '../../../../services/password/password.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  email: string = '';

  constructor(
    private passwordService: PasswordService,
  ) {}

  doSendPasswordResetRequest() {
    this.passwordService.sendPasswordResetRequest(this.email);
  }
}
