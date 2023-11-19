import {afterRender, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {SyncService} from '../../../services/sync/sync.service';

@Component({
  selector: 'app-manage-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-account.component.html',
  styleUrl: './manage-account.component.scss',
})
export class ManageAccountComponent {
  constructor(syncService: SyncService) {
    afterRender(() => {
      syncService.sync();
    });
  }
}
