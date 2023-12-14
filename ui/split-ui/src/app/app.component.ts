import {CommonModule} from '@angular/common';
import {afterRender, Component} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs';

import {NavbarComponent} from './components/lib/navbar/navbar.component';
import {SyncService} from './services/sync/sync.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Split';
  private readonly REFRESH_EVENT_ID = 1;

  constructor(
      syncService: SyncService,
    private router: Router,
  ) {
    afterRender(() => {
      this.router.events
          .pipe(
              filter((routerEvent): routerEvent is NavigationEnd => routerEvent instanceof NavigationEnd),
          )
          .subscribe((event) => {
            if (event.id === this.REFRESH_EVENT_ID && event.url === event.urlAfterRedirects) {
              syncService.sync();
            }
          });
    });
  }
}
