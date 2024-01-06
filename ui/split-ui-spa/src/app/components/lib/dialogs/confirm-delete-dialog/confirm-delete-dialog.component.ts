import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {Store} from '@ngrx/store';

import {PropertyActions} from '../../../pages/_properties/+state/property.actions';

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
  public entityType: string = '';
  public entityId: string = '';
  public entityName: string = '';

  constructor(private store: Store) {
  }

  confirmDelete() {
    this.store.dispatch(PropertyActions.removePropertyById({propertyId: this.entityId}));
  }

  cancelDelete() {
    this.store.dispatch(PropertyActions.removePropertyByIdCanceled({propertyId: this.entityId}));
  }
}
