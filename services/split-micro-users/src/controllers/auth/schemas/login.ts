import {MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const LoginRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
});

export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>;

export const LoginRequestQuerySchema = z.object({});

export type LoginRequestQuery = z.infer<typeof LoginRequestQuerySchema>;
