import {NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router, RouterLink} from '@angular/router';

import {rebaseRoutePath, RoutePath} from '../../../../app.routes';
import {UserDto} from '../../../../dtos/auth/UserDto';
import {AuthService} from '../../../../services/auth/auth.service';
import {PropertyService} from '../../../../services/property/property.service';

@Component({
  selector: 'app-properties-create',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgOptimizedImage,
  ],
  templateUrl: './properties-create.component.html',
  styleUrl: './properties-create.component.scss',
})
export class PropertiesCreateComponent implements OnInit {
  currentUser: UserDto = AuthService.INITIAL_USER;
  name: string = '';

  constructor(
    private propertiesService: PropertyService,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUserInfo();
  }

  doCreateProperty() {
    this.propertiesService.createProperty({
      name: this.name,
      tenantEmails: [this.currentUser.email],
    })
        .subscribe((property) => {
          this.matSnackBar.open(
              `Property with name '${property.name}' created successfully`,
              'OK',
              {duration: 5000},
          );
          this.router.navigate([`${rebaseRoutePath(RoutePath.DASHBOARD)}`])
              .catch((reason) => window.alert(reason));
        });
  }
}
