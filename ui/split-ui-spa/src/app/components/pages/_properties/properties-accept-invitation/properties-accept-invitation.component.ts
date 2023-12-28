import {NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';

import {environment} from '../../../../../environments/environment';
import {rebaseRoutePathAsString, RoutePath} from '../../../../app.routes';
import {PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {PropertyService} from '../../../../services/property/property.service';

@Component({
  selector: 'app-properties-accept-invitation',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  templateUrl: './properties-accept-invitation.component.html',
  styleUrl: './properties-accept-invitation.component.scss',
})
export class PropertiesAcceptInvitationComponent implements OnInit {
  propertyId: string = '';
  tokenValue: string = '';
  property: PropertyDto | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private matSnackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.propertyId = params['propertyId'];
      this.tokenValue = params['tokenValue'];
    });
  }

  doAcceptInvitation() {
    this.propertyService.acceptPropertyInvitation(this.propertyId, this.tokenValue)
        .subscribe((property) => {
          this.property = property;
          this.matSnackBar.open(`Accepted invitation to property: ${property.name}!`, 'Ok', {
            duration: environment.SNACKBAR_DURATION_MS,
          });
        });
  }

  goToProperty() {
    if (!this.property || !this.property.id) {
      return;
    }
    this.router.navigate([rebaseRoutePathAsString(RoutePath.PROPERTIES_DASHBOARD_ID.replace(':propertyId', this.property.id))])
        .catch((reason) => window.alert(reason));
  }
}
