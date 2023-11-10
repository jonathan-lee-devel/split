import {afterRender, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';
import {SyncService} from '../../../services/sync/sync.service';

@Component({
  selector: 'app-google-login-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-login-success.component.html',
  styleUrl: './google-login-success.component.css',
})
export class GoogleLoginSuccessComponent {
  constructor(
      syncService: SyncService,
      private authService: AuthService,
  ) {
    afterRender(() => {
      syncService.sync();
      this.authService.onSuccessfulGoogleLogin();
    });
  }
}
