import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardWithIconComponent} from "../../lib/card-with-icon/card-with-icon.component";
import {LandingPageSplashTextComponent} from "../../lib/landing-page-splash-text/landing-page-splash-text.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, CardWithIconComponent, LandingPageSplashTextComponent, CardWithIconComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
