import {DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {z} from 'zod';

export const GetTokenFromTokenHoldRequestBodySchema = z.object({
  tokenCode: z.string().min(DEFAULT_TOKEN_SIZE).max(DEFAULT_TOKEN_SIZE),
});

export type GetTokenFromTokenHoldRequestBody = z.infer<typeof GetTokenFromTokenHoldRequestBodySchema>;

export const GetTokenFromTokenHoldRequestQuerySchema = z.object({});

export type GetTokenFromTokenHoldRequestQuery = z.infer<typeof GetTokenFromTokenHoldRequestQuerySchema>;
