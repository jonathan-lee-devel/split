import {afterRender, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
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
    private matSnackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
  ) {
    afterRender(() => {
      syncService.sync();
    });
  }

  ngOnInit() {
    if (this.syncService.isClientSide()) {
      this.matSnackBar.open(JSON.stringify(this.authService.getCurrentUserInfo()));
      this.userFirstName = this.authService.getCurrentUserInfo().firstName;
      this.authService.test()
          .subscribe((content: unknown) => {
            this.matSnackBar.open(JSON.stringify(content), 'OK', {duration: 5000});
          });
    }
  }

  ngAfterViewInit() {
    if (this.syncService.isClientSide()) {
      this.changeDetector.detectChanges();
    }
  }
}
