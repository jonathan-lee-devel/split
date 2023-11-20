import {afterRender, AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SyncService} from '../../../services/sync/sync.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements AfterViewInit {
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
