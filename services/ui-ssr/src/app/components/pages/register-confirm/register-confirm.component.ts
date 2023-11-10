import {afterRender, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {RegisterService} from "../../../services/register/register.service";
import {SyncService} from "../../../services/sync/sync.service";

@Component({
    selector: 'app-register-confirm',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './register-confirm.component.html',
    styleUrl: './register-confirm.component.css'
})
export class RegisterConfirmComponent {

    tokenValue: string = '';

    constructor(
        syncService: SyncService,
        private route: ActivatedRoute,
        private registerService: RegisterService,
    ) {
        afterRender(() => {
            syncService.sync();
        })
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