import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-product-with-image',
  templateUrl: './product-with-image.component.html',
  styleUrls: ['./product-with-image.component.css'],
})
export class ProductWithImageComponent {
  @Input() productImageUrl: string = '';
  @Input() productName: string = '';
}
