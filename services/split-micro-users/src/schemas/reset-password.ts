import {z} from 'zod';

export const ResetPasswordRequestBodySchema = z.object({
  email: z.string().email(),
});

export type ResetPasswordRequestBody = z.infer<typeof ResetPasswordRequestBodySchema>;

export const ResetPasswordRequestQuerySchema = z.object({});

export type ResetPasswordRequestQuery = z.infer<typeof ResetPasswordRequestQuerySchema>;
