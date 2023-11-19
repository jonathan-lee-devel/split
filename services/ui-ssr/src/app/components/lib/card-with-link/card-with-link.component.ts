import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {RightArrowComponent} from '../right-arrow/right-arrow.component';

@Component({
  selector: 'app-card-with-link',
  standalone: true,
  imports: [CommonModule, RouterLink, RightArrowComponent],
  templateUrl: './card-with-link.component.html',
  styleUrl: './card-with-link.component.scss',
})
export class CardWithLinkComponent {
  @Input() linkTitle: string = 'Initial Value';
  @Input() linkDescription: string = '';
  @Input() linkText: string = '';
  @Input() linkDestination: string = '';
}
