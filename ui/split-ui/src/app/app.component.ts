import {CommonModule} from '@angular/common';
import {afterRender, AfterViewInit, Component, Signal, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {NavbarComponent} from './components/lib/navbar/navbar.component';
import {AuthService} from './services/auth/auth.service';
import {SyncService} from './services/sync/sync.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  isLoggedIn: Signal<boolean> = this.authService.isLoggedIn.asReadonly();
  title = 'Split';


  @ViewChild(NavbarComponent, {static: true}) navbarComponent: NavbarComponent | undefined;

  constructor(
      syncService: SyncService,
    private authService: AuthService,
  ) {
    afterRender(() => {
      syncService.sync();
    });
  }

  ngAfterViewInit() {
    if (this.navbarComponent) {
      // this.navbarComponent.isLoggedIn.set(this.isLoggedIn());
    }
  }
}
