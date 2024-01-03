import {z} from 'zod';

export const resetPasswordRequestBodySchema = z.object({
  email: z.string().email(),
});

export type ResetPasswordRequestBody = z.infer<typeof resetPasswordRequestBodySchema>;

export const resetPasswordRequestParamsSchema = z.object({});

export type ResetPasswordRequestParams = z.infer<typeof resetPasswordRequestParamsSchema>;

export const resetPasswordRequestQuerySchema = z.object({});

export type ResetPasswordRequestQuery = z.infer<typeof resetPasswordRequestQuerySchema>;

export const resetPasswordRequestHeadersSchema = z.object({});

export type ResetPasswordRequestHeaders = z.infer<typeof resetPasswordRequestHeadersSchema>;
