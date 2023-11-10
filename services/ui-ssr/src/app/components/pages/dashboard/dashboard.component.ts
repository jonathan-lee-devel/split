import {afterRender, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardWithLinkComponent} from "../../lib/card-with-link/card-with-link.component";
import {AuthService} from "../../../services/auth/auth.service";
import {SyncService} from "../../../services/sync/sync.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [CommonModule, CardWithLinkComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(syncService: SyncService) {
    afterRender(() => {
      syncService.sync();
    });
  }

}
