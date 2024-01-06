import {Currency} from '../../types/currency';
import {Dto} from '../Dto';

export interface ExpenseDto extends Dto {
  propertyId: string;
  name: string;
  amount: number;
  currencyCode: Currency;
  createdByEmail: string;
}

export const initialExpenseDto: ExpenseDto = {
  id: '',
  propertyId: '',
  name: '',
  amount: 0,
  currencyCode: 'EUR',
  createdByEmail: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
