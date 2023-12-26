import {
  DEFAULT_CURRENCY_CODE_LENGTH,
  DEFAULT_ID_LENGTH,
  MAX_EXPENSE_NAME_LENGTH,
  MIN_EXPENSE_NAME_LENGTH,
} from '@split-common/split-constants';
import {z} from 'zod';

export const CreateExpenseRequestBodySchema = z.object({
  propertyId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
  name: z.string().min(MIN_EXPENSE_NAME_LENGTH).max(MAX_EXPENSE_NAME_LENGTH),
  amount: z.number(),
  currencyCode: z.string().min(DEFAULT_CURRENCY_CODE_LENGTH).max(DEFAULT_CURRENCY_CODE_LENGTH),
});

export type CreateExpenseRequestBody = z.infer<typeof CreateExpenseRequestBodySchema>;

export const CreateExpenseRequestQuerySchema = z.object({});

export type CreateExpenseRequestQuery = z.infer<typeof CreateExpenseRequestQuerySchema>;
