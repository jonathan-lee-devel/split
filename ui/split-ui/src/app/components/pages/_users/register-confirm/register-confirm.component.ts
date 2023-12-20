import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';

import {RegisterService} from '../../../../services/register/register.service';

@Component({
  selector: 'app-auth-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, ReactiveFormsModule, RouterLink],
  templateUrl: './register-confirm.component.html',
  styleUrl: './register-confirm.component.scss',
})
export class RegisterConfirmComponent implements OnInit {
  tokenValue: string = '';

  constructor(
    private route: ActivatedRoute,
    private registerService: RegisterService,
  ) {
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
