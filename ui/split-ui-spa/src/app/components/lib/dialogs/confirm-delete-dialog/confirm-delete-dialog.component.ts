import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';

import {DeleteEntityByIdFunction} from '../../../../types/delete-entity-by-id';

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

  public onConfirmCallback: DeleteEntityByIdFunction = () => {};

  confirmDelete() {
    this.onConfirmCallback(this.entityId);
  }
}
