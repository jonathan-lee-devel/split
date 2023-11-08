import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-jumbotron-with-message-and-link',
  standalone: true,
    imports: [CommonModule, RouterLink],
  templateUrl: './jumbotron-with-message-and-link.component.html',
  styleUrl: './jumbotron-with-message-and-link.component.css'
})
export class JumbotronWithMessageAndLinkComponent {

}
