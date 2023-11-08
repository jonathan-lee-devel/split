import {Dto} from '../Dto';

export interface ProductDto extends Dto {
  id: string;
  name: string;
  organizationId: string;
  price: string;
}
