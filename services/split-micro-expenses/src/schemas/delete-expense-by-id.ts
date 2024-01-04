import {DEFAULT_ID_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const deleteExpenseByIdRequestBodySchema = z.object({});

export type DeleteExpenseByIdRequestBody = z.infer<typeof deleteExpenseByIdRequestBodySchema>;

export const deleteExpenseByIdRequestParamsSchema = z.object({
  expenseId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
});

export type DeleteExpenseByIdRequestParams = z.infer<typeof deleteExpenseByIdRequestParamsSchema>;

export const deleteExpenseByIdRequestQuerySchema = z.object({});

export type DeleteExpenseByIdRequestQuery = z.infer<typeof deleteExpenseByIdRequestQuerySchema>;

export const deleteExpenseByIdRequestHeadersSchema = z.object({
  authorization: z.string(),
});

export type DeleteExpenseByIdRequestHeaders = z.infer<typeof deleteExpenseByIdRequestHeadersSchema>;
