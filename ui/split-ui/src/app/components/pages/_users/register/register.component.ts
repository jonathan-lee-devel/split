import {afterRender, Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {SyncService} from '../../../../services/sync/sync.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {RegisterService} from '../../../../services/register/register.service';
import {first} from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTermsAndConditions: boolean = false;
  protected readonly first = first;

  constructor(
      syncService: SyncService,
    private authService: AuthService,
    private registerService: RegisterService,
  ) {
    afterRender(() => {
      syncService.sync();
    });
  }

  doGoogleLogin() {
    this.authService.doGoogleLogin();
  }

  doRegister() {
    this.registerService.doRegister({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      confirmPassword: this.confirmPassword,
      acceptTermsAndConditions: this.acceptTermsAndConditions,
    });
  }
}
