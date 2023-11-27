import {afterRender, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';
import {SyncService} from '../../../services/sync/sync.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  userFirstName: string = '';

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
