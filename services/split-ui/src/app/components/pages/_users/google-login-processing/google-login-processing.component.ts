import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from '../../../lib/loading-spinner/loading-spinner.component';
import {SuccessCheckmarkComponent} from '../../../lib/success-checkmark/success-checkmark.component';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-google-login-processing',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, SuccessCheckmarkComponent],
  templateUrl: './google-login-processing.component.html',
  styleUrl: './google-login-processing.component.scss',
})
export class GoogleLoginProcessingComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    window.location.href = `${environment.USERS_SERVICE_BASE_URL}/auth/google`;
  }
}
