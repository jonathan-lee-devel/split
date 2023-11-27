import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-card-with-link',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card-with-link.component.html',
  styleUrl: './card-with-link.component.scss',
})
export class CardWithLinkComponent {
  @Input({required: true}) cardHeaderText: string = '';
  @Input({required: true}) cardTitle: string = '';
  @Input({required: true}) cardBodyText: string = '';
  @Input({required: true}) cardButtonText: string = '';
  @Input({required: true}) cardButtonTargetLink: string = '';
}
