import {afterRender, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from '../../lib/loading-spinner/loading-spinner.component';
import {environment} from '../../../../environments/environment';
import {SuccessCheckmarkComponent} from "../../lib/success-checkmark/success-checkmark.component";

@Component({
  selector: 'app-google-login-processing',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, SuccessCheckmarkComponent],
  templateUrl: './google-login-processing.component.html',
  styleUrl: './google-login-processing.component.css',
})
export class GoogleLoginProcessingComponent {
  constructor() {
    afterRender(() => {
      window.location.href = `${environment.RAW_API_URL}/auth/google`;
    });
  }
}
