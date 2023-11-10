import {Component, Input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-card-with-icon',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './card-with-icon.component.html',
  styleUrl: './card-with-icon.component.css',
})
export class CardWithIconComponent {
  @Input() cardTitle: string = '';
  @Input() cardText: string = '';
  @Input() cardIconPath: string = '';
  @Input() cardIconAlt: string = '';
  @Input() cardIconHeight: number = 0;
  @Input() cardIconWidth: number = 0;
}
