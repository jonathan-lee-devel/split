import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-with-link',
  templateUrl: './card-with-link.component.html',
  styleUrls: ['./card-with-link.component.css'],
})
export class CardWithLinkComponent {
  @Input() linkTitle: string = '';
  @Input() linkDescription: string = '';
  @Input() linkText: string = '';
  @Input() linkDestination: string = '';
}
