import {z} from 'zod';

export const GetPropertyByIdRequestBodySchema = z.object({});

export type GetPropertyByIdRequestBody = z.infer<typeof GetPropertyByIdRequestBodySchema>;

export const GetPropertyByIdRequestQuerySchema = z.object({});

export type GetPropertyByIdRequestQuery = z.infer<typeof GetPropertyByIdRequestQuerySchema>;
