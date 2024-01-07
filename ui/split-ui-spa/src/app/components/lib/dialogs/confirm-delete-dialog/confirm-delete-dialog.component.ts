import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {Store} from '@ngrx/store';

import {EntityType} from '../../../../types/entity';
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
  public entityType: EntityType = 'Property';
  public entityId: string = '';
  public entityName: string = '';

  constructor(private store: Store) {
  }

  confirmDelete() {
    switch (this.entityType) {
      case 'Property':
        this.store.dispatch(PropertyActions.removePropertyById({propertyId: this.entityId}));
        break;
      case 'Expense':
        // TODO: Implement dispatch remove expense by ID
        break;
      default:
        throw new Error('Unrecognized Entity Type');
    }
  }

  cancelDelete() {
    switch (this.entityType) {
      case 'Property':
        this.store.dispatch(PropertyActions.removePropertyByIdCanceled({propertyId: this.entityId}));
        break;
      case 'Expense':
        // TODO: Implement dispatch remove expense by ID canceled
        break;
      default:
        throw new Error('Unrecognized Entity Type');
    }
  }
}
