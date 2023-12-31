import {DEFAULT_ID_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const deletePropertyByIdRequestBodySchema = z.object({});

export type DeletePropertyByIdRequestBody = z.infer<typeof deletePropertyByIdRequestBodySchema>;

export const deletePropertyByIdRequestParamsSchema = z.object({
  propertyId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
});

export type DeletePropertyByIdRequestParams = z.infer<typeof deletePropertyByIdRequestParamsSchema>;

export const deletePropertyByIdRequestQuerySchema = z.object({});

export type DeletePropertyByIdRequestQuery = z.infer<typeof deletePropertyByIdRequestQuerySchema>;

export const deletePropertyByIdRequestHeadersSchema = z.object({});

export type DeletePropertyByIdRequestHeaders = z.infer<typeof deletePropertyByIdRequestHeadersSchema>;
