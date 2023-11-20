import {afterRender, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from '../../../lib/loading-spinner/loading-spinner.component';
import {SuccessCheckmarkComponent} from '../../../lib/success-checkmark/success-checkmark.component';
import {SyncService} from '../../../../services/sync/sync.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-google-login-success',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, SuccessCheckmarkComponent],
  templateUrl: './google-login-success.component.html',
  styleUrl: './google-login-success.component.scss',
})
export class GoogleLoginSuccessComponent {
  tokenCode = '';

  constructor(
      syncService: SyncService,
      private authService: AuthService,
      private route: ActivatedRoute,
      private snackBar: MatSnackBar,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.tokenCode = params['tokenCode'];
    });
    afterRender(() => {
      syncService.sync();
      setTimeout(() => {
        this.authService.onSuccessfulGoogleLogin(this.tokenCode);
      }, 2500);
    });
  }
}
