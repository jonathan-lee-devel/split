import {CommonModule} from '@angular/common';
import {afterRender, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {RegisterService} from '../../../../services/register/register.service';
import {SyncService} from '../../../../services/sync/sync.service';

@Component({
  selector: 'app-auth-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-confirm.component.html',
  styleUrl: './register-confirm.component.scss',
})
export class RegisterConfirmComponent implements OnInit {
  tokenValue: string = '';

  constructor(
      syncService: SyncService,
        private route: ActivatedRoute,
        private registerService: RegisterService,
  ) {
    afterRender(() => {
      syncService.sync();
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tokenValue = params['tokenValue'];
    });
  }

  doConfirmRegister() {
    this.registerService.doConfirmRegister(this.tokenValue);
  }
}
