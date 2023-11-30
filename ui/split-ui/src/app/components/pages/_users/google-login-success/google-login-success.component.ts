import {afterRender, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from '../../../lib/loading-spinner/loading-spinner.component';
import {SuccessCheckmarkComponent} from '../../../lib/success-checkmark/success-checkmark.component';
import {AuthService} from '../../../../services/auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {SyncService} from '../../../../services/sync/sync.service';

@Component({
  selector: 'app-google-login-success',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, SuccessCheckmarkComponent],
  templateUrl: './google-login-success.component.html',
  styleUrl: './google-login-success.component.scss',
})
export class GoogleLoginSuccessComponent implements OnInit {
  constructor(
      private syncService: SyncService,
      private authService: AuthService,
      private route: ActivatedRoute,
  ) {
    afterRender(() => {

    });
  }

  ngOnInit() {
    if (this.syncService.isClientSide()) {
      this.route.queryParams.subscribe((params) => {
        setTimeout(() => {
          this.authService.onSuccessfulGoogleLogin(params['tokenCode']);
        }, 2500);
      });
    }
  }
}
