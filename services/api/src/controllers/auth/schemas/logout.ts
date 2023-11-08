import {z} from 'zod';

export const LogoutRequestBodySchema = z.object({});

export type LogoutRequestBody = z.infer<typeof LogoutRequestBodySchema>;

export const LogoutRequestQuerySchema = z.object({});

export type LogoutRequestQuery = z.infer<typeof LogoutRequestQuerySchema>;
