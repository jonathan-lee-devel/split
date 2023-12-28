import {NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router, RouterLink} from '@angular/router';
import {delay} from 'rxjs';

import {environment} from '../../../../../environments/environment';
import {rebaseRoutePath, RoutePath} from '../../../../app.routes';
import {UserDto} from '../../../../dtos/auth/UserDto';
import {AuthService} from '../../../../services/auth/auth.service';
import {LoadingService} from '../../../../services/loading/loading.service';
import {PropertyService} from '../../../../services/property/property.service';

@Component({
  selector: 'app-properties-create',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgOptimizedImage,
    MatProgressSpinnerModule,
  ],
  templateUrl: './properties-create.component.html',
  styleUrl: './properties-create.component.scss',
})
export class PropertiesCreateComponent implements OnInit {
  currentUser: UserDto = AuthService.INITIAL_USER;
  name: string = '';
  isLoadingMap_ = this.loadingService.isLoadingMap_;
  protected readonly isPropertyCreateLoadingKey = 'is-property-create-loading-key';

  constructor(
    private propertiesService: PropertyService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUserInfo();
  }

  doCreateProperty() {
    this.loadingService.onLoadingStart(this.isPropertyCreateLoadingKey);
    this.propertiesService.createProperty({
      name: this.name,
      tenantEmails: [this.currentUser.email],
    }).pipe(
        delay(environment.SIMULATED_LOADING_DELAY_MS),
    ).subscribe((property) => {
      this.matSnackBar.open(
          `Property with name '${property.name}' created successfully`,
          'OK',
          {duration: 5000},
      );
      this.loadingService.onLoadingFinished(this.isPropertyCreateLoadingKey);
      this.router.navigate([`${rebaseRoutePath(RoutePath.DASHBOARD)}`])
          .catch((reason) => window.alert(reason));
    });
  }
}
