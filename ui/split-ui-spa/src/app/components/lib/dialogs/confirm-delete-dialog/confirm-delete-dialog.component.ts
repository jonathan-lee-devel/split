import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

import {rebaseRoutePath, RoutePath} from '../../../../app.routes';
import {PropertyService} from '../../../../services/property/property.service';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.scss',
})
export class ConfirmDeleteDialogComponent {
  public propertyId: string = '';
  public propertyName: string = '';

  constructor(
    private propertyService: PropertyService,
    private matSnackBar: MatSnackBar,
    private router: Router,
  ) {}

  confirmDelete() {
    this.propertyService.deletePropertyById(this.propertyId)
        .subscribe((property) => {
          this.router.navigate([rebaseRoutePath(RoutePath.PROPERTIES_MANAGE)]).catch((reason) => window.alert(reason));
          this.matSnackBar.open(`Property: ${property.name} deleted successfully!`, 'Ok', {
            duration: 5000,
          });
        });
  }
}
