import {afterRender, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-google-login-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-login-success.component.html',
  styleUrl: './google-login-success.component.css'
})
export class GoogleLoginSuccessComponent {

  constructor(private authService: AuthService) {
    afterRender(() => {
      this.authService.onSuccessfulGoogleLogin();
    })
  }
}
