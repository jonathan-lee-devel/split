import {MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const loginRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
});

export type LoginRequestBody = z.infer<typeof loginRequestBodySchema>;

export const loginRequestParamsSchema = z.object({});

export type LoginRequestParams = z.infer<typeof loginRequestParamsSchema>;

export const loginRequestQuerySchema = z.object({});

export type LoginRequestQuery = z.infer<typeof loginRequestQuerySchema>;

export const loginRequestHeadersSchema = z.object({});

export type LoginRequestHeaders = z.infer<typeof loginRequestHeadersSchema>;
