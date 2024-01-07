import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {BehaviorSubject, Observable} from 'rxjs';

import {PropertyActions} from '../+state/property.actions';
import {UserDto} from '../../../../dtos/auth/UserDto';
import {AuthService} from '../../../../services/auth/auth.service';
import {LoadStatus} from '../../../../types/load-status';

@Component({
  selector: 'app-properties-create',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgOptimizedImage,
    MatProgressSpinnerModule,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './properties-create.component.html',
  styleUrl: './properties-create.component.scss',
})
export class PropertiesCreateComponent {
  currentUser: UserDto = AuthService.INITIAL_USER;
  name: string = '';
  loadStatus$: Observable<LoadStatus>;
  private loadStatus = new BehaviorSubject<LoadStatus>('LOADED');

  constructor(
    private store: Store,
    private authService: AuthService,
  ) {
    this.currentUser = this.authService.getCurrentUserInfo();
    this.loadStatus$ = this.loadStatus.asObservable();
  }

  doCreateProperty() {
    this.loadStatus.next('LOADING');
    this.store.dispatch(PropertyActions.addProperty({propertyCreateRequest: {
      name: this.name,
      tenantEmails: [this.currentUser.email],
    }}));
  }
}
