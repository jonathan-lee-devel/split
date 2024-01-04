import {
  DEFAULT_CURRENCY_CODE_LENGTH,
  DEFAULT_ID_LENGTH,
  MAX_EXPENSE_NAME_LENGTH,
  MIN_EXPENSE_NAME_LENGTH,
} from '@split-common/split-constants';
import {z} from 'zod';

export const createExpenseRequestBodySchema = z.object({
  propertyId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
  name: z.string().min(MIN_EXPENSE_NAME_LENGTH).max(MAX_EXPENSE_NAME_LENGTH),
  amount: z.number(),
  currencyCode: z.string().min(DEFAULT_CURRENCY_CODE_LENGTH).max(DEFAULT_CURRENCY_CODE_LENGTH),
});

export type CreateExpenseRequestBody = z.infer<typeof createExpenseRequestBodySchema>;

export const createExpenseRequestParamsSchema = z.object({});

export type CreateExpenseRequestParams = z.infer<typeof createExpenseRequestParamsSchema>;

export const createExpenseRequestQuerySchema = z.object({});

export type CreateExpenseRequestQuery = z.infer<typeof createExpenseRequestQuerySchema>;

export const createExpenseRequestHeadersSchema = z.object({});

export type CreateExpenseRequestHeaders = z.infer<typeof createExpenseRequestHeadersSchema>;
