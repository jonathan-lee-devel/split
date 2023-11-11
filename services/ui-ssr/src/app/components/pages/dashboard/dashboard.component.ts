import {afterRender, AfterViewInit, ChangeDetectorRef, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardWithLinkComponent} from '../../lib/card-with-link/card-with-link.component';
import {SyncService} from '../../../services/sync/sync.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardWithLinkComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements AfterViewInit {
  #manageOrganizationsCardTitle = signal('Manage Existing Organizations');
  manageOrganizationsCardTitle = this.#manageOrganizationsCardTitle.asReadonly();

  constructor(
      syncService: SyncService,
      private changeDetector: ChangeDetectorRef,
  ) {
    afterRender(() => {
      syncService.sync();
    });
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }
}
