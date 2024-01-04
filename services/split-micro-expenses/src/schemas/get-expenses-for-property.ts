import {DEFAULT_ID_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const getExpensesForPropertyRequestBodySchema = z.object({});

export type GetExpensesForPropertyRequestBody = z.infer<typeof getExpensesForPropertyRequestBodySchema>;

export const getExpensesForPropertyRequestParamsSchema = z.object({
  propertyId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
});

export type GetExpensesForPropertyRequestParams = z.infer<typeof getExpensesForPropertyRequestParamsSchema>;

export const getExpensesForPropertyRequestQuerySchema = z.object({});

export type GetExpensesForPropertyRequestQuery = z.infer<typeof getExpensesForPropertyRequestQuerySchema>;

export const getExpensesForPropertyRequestHeadersSchema = z.object({
  authorization: z.string(),
});

export type GetExpensesForPropertyRequestHeaders = z.infer<typeof getExpensesForPropertyRequestHeadersSchema>;
