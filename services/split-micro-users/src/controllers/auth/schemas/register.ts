import {z} from 'zod';

export const RegisterRequestBodySchema = z.object({
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export type RegisterRequestBody = z.infer<typeof RegisterRequestBodySchema>;

export const RegisterRequestQuerySchema = z.object({});

export type RegisterRequestQuery = z.infer<typeof RegisterRequestQuerySchema>;
