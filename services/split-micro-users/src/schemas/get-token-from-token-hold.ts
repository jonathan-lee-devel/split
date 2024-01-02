import {DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {z} from 'zod';

export const getTokenFromTokenHoldRequestBodySchema = z.object({
  tokenCode: z.string().min(DEFAULT_TOKEN_SIZE).max(DEFAULT_TOKEN_SIZE),
});

export type GetTokenFromTokenHoldRequestBody = z.infer<typeof getTokenFromTokenHoldRequestBodySchema>;

export const getTokenFromTokenHoldRequestParamsSchema = z.object({});

export type GetTokenFromTokenHoldRequestParams = z.infer<typeof getTokenFromTokenHoldRequestParamsSchema>;

export const getTokenFromTokenHoldRequestQuerySchema = z.object({});

export type GetTokenFromTokenHoldRequestQuery = z.infer<typeof getTokenFromTokenHoldRequestQuerySchema>;

export const getTokenFromTokenHoldRequestHeadersSchema = z.object({});

export type GetTokenFromTokenHoldRequestHeaders = z.infer<typeof getTokenFromTokenHoldRequestHeadersSchema>;
