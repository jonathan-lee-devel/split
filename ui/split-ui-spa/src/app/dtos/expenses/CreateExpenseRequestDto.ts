import {Currency} from '../../types/currency';

export interface CreateExpenseRequestDto {
  propertyId: string;
  name: string;
  amount: number;
  currencyCode: Currency;
}
