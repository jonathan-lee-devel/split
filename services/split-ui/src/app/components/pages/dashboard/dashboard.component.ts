import {afterRender, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';
import {SyncService} from '../../../services/sync/sync.service';
import {CardWithLinkComponent} from '../../lib/card-with-link/card-with-link.component';
import {RoutePaths} from '../../../app.routes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardWithLinkComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  userFirstName: string = '';
  protected readonly RoutePaths = RoutePaths;

  constructor(
    private syncService: SyncService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
  ) {
    afterRender(() => {
      syncService.sync();
    });
  }

  ngOnInit() {
    if (this.syncService.isClientSide()) {
      this.userFirstName = this.authService.getCurrentUserInfo().firstName;
    }
  }

  ngAfterViewInit() {
    if (this.syncService.isClientSide()) {
      this.changeDetector.detectChanges();
    }
  }
}
