import {z} from 'zod';

export const GetExpensesForPropertyRequestBodySchema = z.object({});

export type GetExpensesForPropertyRequestBody = z.infer<typeof GetExpensesForPropertyRequestBodySchema>;

export const GetExpensesForPropertyRequestQuerySchema = z.object({});

export type GetExpensesForPropertyRequestQuery = z.infer<typeof GetExpensesForPropertyRequestQuerySchema>;
