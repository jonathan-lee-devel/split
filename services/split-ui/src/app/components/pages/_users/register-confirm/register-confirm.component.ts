import {afterRender, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {SyncService} from '../../../../services/sync/sync.service';
import {RegisterService} from '../../../../services/register/register.service';

@Component({
  selector: 'app-auth-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-confirm.component.html',
  styleUrl: './auth-confirm.component.scss',
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
