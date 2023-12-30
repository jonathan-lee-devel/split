import {MAX_PROPERTY_NAME_LENGTH, MIN_PROPERTY_NAME_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const createPropertyRequestBodySchema = z.object({
  name: z.string().min(MIN_PROPERTY_NAME_LENGTH).max(MAX_PROPERTY_NAME_LENGTH),
  tenantEmails: z.array(z.string().email()),
});

export type CreatePropertyRequestBody = z.infer<typeof createPropertyRequestBodySchema>;

export const createPropertyRequestParamsSchema = z.object({});

export type CreatePropertyRequestParams = z.infer<typeof createPropertyRequestParamsSchema>;

export const createPropertyRequestQuerySchema = z.object({});

export type CreatePropertyRequestQuery = z.infer<typeof createPropertyRequestQuerySchema>;
