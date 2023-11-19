import {afterRender, Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {SyncService} from '../../../../services/sync/sync.service';
import {PasswordService} from '../../../../services/password/password.service';

@Component({
  selector: 'app-reset-password-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password-confirm.component.html',
  styleUrl: './reset-password-confirm.component.scss',
})
export class ResetPasswordConfirmComponent {
  tokenValue: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
      syncService: SyncService,
      private route: ActivatedRoute,
      private passwordService: PasswordService,
  ) {
    afterRender(() => {
      syncService.sync();
      this.route.params.subscribe((params) => {
        this.tokenValue = params['tokenValue'];
      });
    });
  }

  doConfirmPasswordReset() {
    this.passwordService.confirmPasswordReset(this.tokenValue, this.password, this.confirmPassword);
  }
}
