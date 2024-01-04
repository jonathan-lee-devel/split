import {DEFAULT_ID_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const getExpenseByIdRequestBodySchema = z.object({});

export type GetExpenseByIdRequestBody = z.infer<typeof getExpenseByIdRequestBodySchema>;

export const getExpenseByIdRequestParamsSchema = z.object({
  expenseId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
});

export type GetExpenseByIdRequestParams = z.infer<typeof getExpenseByIdRequestParamsSchema>;

export const getExpenseByIdRequestQuerySchema = z.object({});

export type GetExpenseByIdRequestQuery = z.infer<typeof getExpenseByIdRequestQuerySchema>;

export const getExpenseByIdRequestHeadersSchema = z.object({
  authorization: z.string(),
});

export type GetExpenseByIdRequestHeaders = z.infer<typeof getExpenseByIdRequestHeadersSchema>;
