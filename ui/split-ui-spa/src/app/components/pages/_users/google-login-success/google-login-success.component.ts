import {CommonModule} from '@angular/common';
import {afterRender, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {delay} from 'rxjs';

import {AuthService} from '../../../../services/auth/auth.service';
import {ServerClientSyncService} from '../../../../services/server-client-sync/server-client-sync.service';
import {LoadingSpinnerComponent} from '../../../lib/loading-spinner/loading-spinner.component';
import {SuccessCheckmarkComponent} from '../../../lib/success-checkmark/success-checkmark.component';

@Component({
  selector: 'app-google-login-success',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, SuccessCheckmarkComponent],
  templateUrl: './google-login-success.component.html',
  styleUrl: './google-login-success.component.scss',
})
export class GoogleLoginSuccessComponent implements OnInit {
  constructor(
      private syncService: ServerClientSyncService,
      private authService: AuthService,
      private route: ActivatedRoute,
  ) {
    afterRender(() => {

    });
  }

  ngOnInit() {
    if (this.syncService.isClientSide()) {
      this.route.queryParams
          .pipe(
              delay(2500),
          ).subscribe((params) => {
            this.authService.onSuccessfulGoogleLogin(params['tokenCode']);
          });
    }
  }
}
