import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardWithLinkComponent} from "../../lib/card-with-link/card-with-link.component";
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [CommonModule, CardWithLinkComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.triggerOnServerReload();
  }

}
