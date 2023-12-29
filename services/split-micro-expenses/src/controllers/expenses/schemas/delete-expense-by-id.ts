import {z} from 'zod';

export const DeleteExpenseByIdRequestBodySchema = z.object({});

export type DeleteExpenseByIdRequestBody = z.infer<typeof DeleteExpenseByIdRequestBodySchema>;

export const DeleteExpenseByIdRequestQuerySchema = z.object({});

export type DeleteExpenseByIdRequestQuery = z.infer<typeof DeleteExpenseByIdRequestQuerySchema>;
