import {z} from 'zod';

export const GetProfileRequestBodySchema = z.object({});

export type GetProfileRequestBody = z.infer<typeof GetProfileRequestBodySchema>;

export const GetProfileRequestQuerySchema = z.object({});

export type GetProfileRequestQuery = z.infer<typeof GetProfileRequestQuerySchema>;
