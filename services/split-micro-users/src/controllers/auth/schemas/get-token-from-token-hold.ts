import {z} from 'zod';

export const GetTokenFromTokenHoldRequestBodySchema = z.object({
  tokenCode: z.string(),
});

export type GetTokenFromTokenHoldRequestBody = z.infer<typeof GetTokenFromTokenHoldRequestBodySchema>;

export const GetTokenFromTokenHoldRequestQuerySchema = z.object({});

export type GetTokenFromTokenHoldRequestQuery = z.infer<typeof GetTokenFromTokenHoldRequestQuerySchema>;
