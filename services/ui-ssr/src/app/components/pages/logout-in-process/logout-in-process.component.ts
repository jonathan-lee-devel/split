import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingSpinnerComponent} from "../../lib/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-logout-in-process',
  standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './logout-in-process.component.html',
  styleUrl: './logout-in-process.component.scss'
})
export class LogoutInProcessComponent {

}
