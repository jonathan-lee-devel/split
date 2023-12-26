import {z} from 'zod';

export const GetExpenseByIdRequestBodySchema = z.object({});

export type GetExpenseByIdRequestBody = z.infer<typeof GetExpenseByIdRequestBodySchema>;

export const GetExpenseByIdRequestQuerySchema = z.object({});

export type GetExpenseByIdRequestQuery = z.infer<typeof GetExpenseByIdRequestQuerySchema>;
