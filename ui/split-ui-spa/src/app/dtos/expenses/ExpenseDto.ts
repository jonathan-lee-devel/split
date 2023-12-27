import {Currency} from '../../types/currency';
import {Dto} from '../Dto';

export interface ExpenseDto extends Dto {
  propertyId: string;
  name: string;
  amount: number;
  currencyCode: Currency;
  createdByEmail: string;
}
