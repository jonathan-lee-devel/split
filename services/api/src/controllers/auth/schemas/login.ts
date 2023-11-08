import {z} from 'zod';

export const LoginRequestBodySchema = z.object({});

export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>;

export const LoginRequestQuerySchema = z.object({});

export type LoginRequestQuery = z.infer<typeof LoginRequestQuerySchema>;
