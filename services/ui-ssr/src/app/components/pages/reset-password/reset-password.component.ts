import {afterRender, Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {PasswordService} from '../../../services/password/password.service';
import {SyncService} from '../../../services/sync/sync.service';

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
      syncService: SyncService,
        private passwordService: PasswordService,
  ) {
    afterRender(() => {
      syncService.sync();
    });
  }

  doSendPasswordResetRequest() {
    this.passwordService.sendPasswordResetRequest(this.email);
  }
}
