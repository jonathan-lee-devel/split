import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';

import {PasswordService} from '../../../../services/password/password.service';

@Component({
  selector: 'app-reset-password-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password-confirm.component.html',
  styleUrl: './reset-password-confirm.component.scss',
})
export class ResetPasswordConfirmComponent implements OnInit {
  tokenValue: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private passwordService: PasswordService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tokenValue = params['tokenValue'];
    });
  }

  doConfirmPasswordReset() {
    this.passwordService.confirmPasswordReset(this.tokenValue, this.password, this.confirmPassword);
  }
}
