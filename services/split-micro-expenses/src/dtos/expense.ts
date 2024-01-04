import {Dto} from '@split-common/split-http';
import {Currency} from 'dinero.js';

export interface ExpenseDto extends Dto {
  propertyId: string;
  name: string;
  amount: number;
  currencyCode: Currency;
  createdByEmail: string;
}
