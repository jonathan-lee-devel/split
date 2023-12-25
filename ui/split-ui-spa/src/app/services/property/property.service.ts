import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {rebaseRoutePath, RoutePath} from '../../app.routes';
import {ConfirmActionDialogComponent} from '../../components/lib/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import {ConfirmDeleteDialogComponent} from '../../components/lib/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import {PropertyCreateRequestDto} from '../../dtos/properties/PropertyCreateRequestDto';
import {PropertyDto} from '../../dtos/properties/PropertyDto';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private readonly entityType = 'Property';

  constructor(
    private httpClient: HttpClient,
    private confirmDeleteDialog: MatDialog,
    private confirmActionDialog: MatDialog,
    private router: Router,
    private matSnackBar: MatSnackBar,
  ) {
  }

  public getPropertyById(propertyId: string): Observable<PropertyDto> {
    return this.httpClient.get<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/id/${propertyId}`);
  }

  public getPropertiesWhereInvolved(): Observable<PropertyDto[]> {
    return this.httpClient.get<PropertyDto[]>(`${environment.PROPERTIES_SERVICE_BASE_URL}/where-involved`);
  }

  public createProperty(propertyCreateRequestDto: PropertyCreateRequestDto) {
    return this.httpClient.post<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/`, propertyCreateRequestDto);
  }

  public deletePropertyById(propertyId: string): Observable<PropertyDto> {
    return this.httpClient.delete<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/id/${propertyId}`);
  }

  public togglePropertyAdministratorStatus(propertyId: string, emailToToggle: string): Observable<PropertyDto> {
    return this.httpClient.patch<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/id/${propertyId}/toggle-property-admin`, {emailToToggle});
  }

  public togglePropertyTenantStatus(propertyId: string, emailToToggle: string): Observable<PropertyDto> {
    return this.httpClient.patch<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/id/${propertyId}/toggle-property-tenant`, {emailToToggle});
  }

  public acceptPropertyInvitation(propertyId: string, tokenValue: string): Observable<PropertyDto> {
    return this.httpClient.patch<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/id/${propertyId}/accept-invitation`, {tokenValue});
  }

  public inviteTenantToProperty(propertyId: string, emailToInvite: string): Observable<PropertyDto> {
    return this.httpClient.patch<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/id/${propertyId}/invite-tenant`, {emailToInvite});
  }

  public openDeletePropertyDialog(propertyId: string, propertyName: string) {
    const dialogRef = this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, {
      disableClose: false,
      enterAnimationDuration: 500,
    });
    dialogRef.componentInstance.entityType = this.entityType;
    dialogRef.componentInstance.entityId = propertyId;
    dialogRef.componentInstance.entityName = propertyName;
    dialogRef.componentInstance.onConfirmCallback = (propertyId) => {
      this.deletePropertyById(propertyId)
          .subscribe((property) => {
            this.router.navigate([rebaseRoutePath(RoutePath.PROPERTIES_MANAGE)]).catch((reason) => window.alert(reason));
            this.matSnackBar.open(`Property: ${property.name} deleted successfully!`, 'Ok', {
              duration: 5000,
            });
          });
    };
  }

  async openTogglePropertyAdminDialog(property: PropertyDto, combinedEmail: string): Promise<PropertyDto> {
    return new Promise<PropertyDto>((resolve) => {
      const dialogRef = this.confirmActionDialog.open(ConfirmActionDialogComponent, {
        disableClose: false,
        enterAnimationDuration: 500,
      });
      dialogRef.componentInstance.entityId = property.id;
      dialogRef.componentInstance.prompt = this.getPromptForToggleAdministrator(property, combinedEmail);
      dialogRef.componentInstance.data = {emailToToggle: combinedEmail};
      dialogRef.componentInstance.onConfirmCallback = (propertyId, data: unknown) => {
        // @ts-expect-error emailToToggle is known in this case to be a part of the data
        this.togglePropertyAdministratorStatus(propertyId, (data && data.emailToToggle) ? data.emailToToggle : '')
            .subscribe((updatedProperty) => {
              resolve(updatedProperty);
              this.matSnackBar.open(this.getSnackBarMessageForToggleAdministratorStatus(property, updatedProperty, combinedEmail), 'Ok', {
                duration: 5000,
              });
            });
      };
    });
  }

  async openTogglePropertyTenantDialog(property: PropertyDto, combinedEmail: string): Promise<PropertyDto> {
    return new Promise<PropertyDto>((resolve) => {
      const dialogRef = this.confirmActionDialog.open(ConfirmActionDialogComponent, {
        disableClose: false,
        enterAnimationDuration: 500,
      });
      dialogRef.componentInstance.entityId = property.id;
      dialogRef.componentInstance.prompt = this.getPromptForToggleTenant(property, combinedEmail);
      dialogRef.componentInstance.data = {emailToToggle: combinedEmail};
      dialogRef.componentInstance.onConfirmCallback = (propertyId, data: unknown) => {
        // @ts-expect-error emailToToggle is known in this case to be a part of the data
        this.togglePropertyTenantStatus(propertyId, (data && data.emailToToggle) ? data.emailToToggle : '')
            .subscribe((updatedProperty) => {
              resolve(updatedProperty);
              this.matSnackBar.open(this.getSnackBarMessageForToggleTenantStatus(property, updatedProperty, combinedEmail), 'Ok', {
                duration: 5000,
              });
            });
      };
    });
  }

  private getSnackBarMessageForToggleAdministratorStatus(
      originalProperty: PropertyDto,
      updatedProperty: PropertyDto,
      combinedEmail: string,
  ) {
    const removedAdministrators = originalProperty.administratorEmails
        .filter((administratorEmail) =>
          updatedProperty.administratorEmails.indexOf(administratorEmail) < 0);
    return (removedAdministrators.length >= 1) ?
      `${removedAdministrators[0]} has been removed as an administrator of property: ${updatedProperty.name}` :
      `${combinedEmail} has been added as an administrator of property: ${updatedProperty.name}`;
  }

  private getSnackBarMessageForToggleTenantStatus(
      originalProperty: PropertyDto,
      updatedProperty: PropertyDto,
      combinedEmail: string,
  ) {
    const removedTenants = originalProperty.tenantEmails
        .filter((tenantEmail) =>
          updatedProperty.tenantEmails.indexOf(tenantEmail) < 0);
    return (removedTenants.length >= 1) ?
      `${removedTenants[0]} has been removed as a tenant from the property: ${updatedProperty.name}` :
      `${combinedEmail} has been added as a tenant to the property: ${updatedProperty.name}`;
  }

  private getPromptForToggleAdministrator(property: PropertyDto, combinedEmail: string) {
    return property.administratorEmails.includes(combinedEmail) ?
      `Do you want to remove ${combinedEmail} as an administrator of property: ${property.name}?` :
      `Do you want to add ${combinedEmail} as an administrator of property: ${property.name}?`;
  }

  private getPromptForToggleTenant(property: PropertyDto, combinedEmail: string) {
    if (property.administratorEmails.includes(combinedEmail) &&
    property.tenantEmails.includes(combinedEmail)) {
      return `Do you want to remove ${combinedEmail} as a tenant of property: ${property.name}?`;
    } else if (!property.administratorEmails.includes(combinedEmail) &&
    property.tenantEmails.includes(combinedEmail)) {
      return `Do you want to completely remove ${combinedEmail} from property: ${property.name}?`;
    }
    return `Do you want to add ${combinedEmail} as tenant of property: ${property.name}?`;
  }
}
