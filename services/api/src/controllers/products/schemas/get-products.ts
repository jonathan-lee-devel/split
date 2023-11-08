import {z} from 'zod';

export const GetProductsRequestBodySchema = z.object({});

export type GetProductsRequestBody = z.infer<typeof GetProductsRequestBodySchema>;

export const GetProductsRequestQuerySchema = z.object({});

export type GetProductsRequestQuery = z.infer<typeof GetProductsRequestQuerySchema>;
