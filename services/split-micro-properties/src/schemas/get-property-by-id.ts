import {DEFAULT_ID_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const getPropertyByIdRequestBodySchema = z.object({});

export type GetPropertyByIdRequestBody = z.infer<typeof getPropertyByIdRequestBodySchema>;

export const getPropertyByIdRequestParamsSchema = z.object({
  propertyId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
});

export type GetPropertyByIdRequestParams = z.infer<typeof getPropertyByIdRequestParamsSchema>;

export const getPropertyByIdRequestQuerySchema = z.object({});

export type GetPropertyByIdRequestQuery = z.infer<typeof getPropertyByIdRequestQuerySchema>;

export const getPropertyByIdRequestHeadersSchema = z.object({
  'x-micro-communications': z.string().optional(),
});

export type GetPropertyByIdRequestHeaders = z.infer<typeof getPropertyByIdRequestHeadersSchema>;
