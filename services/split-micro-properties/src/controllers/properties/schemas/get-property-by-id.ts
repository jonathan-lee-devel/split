import {z} from 'zod';

export const GetPropertiesByIdRequestBodySchema = z.object({});

export type GetPropertiesByIdRequestBody = z.infer<typeof GetPropertiesByIdRequestBodySchema>;

export const GetPropertyByIdRequestQuerySchema = z.object({});

export type GetPropertyByIdRequestQuery = z.infer<typeof GetPropertyByIdRequestQuerySchema>;
