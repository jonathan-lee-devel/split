import {z} from 'zod';

export const LoginRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>;

export const LoginRequestQuerySchema = z.object({});

export type LoginRequestQuery = z.infer<typeof LoginRequestQuerySchema>;
