import {MAX_PROPERTY_NAME_LENGTH, MIN_PROPERTY_NAME_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const CreatePropertyRequestBodySchema = z.object({
  name: z.string().min(MIN_PROPERTY_NAME_LENGTH).max(MAX_PROPERTY_NAME_LENGTH),
  tenantEmails: z.array(z.string().email()),
});

export type CreatePropertyRequestBody = z.infer<typeof CreatePropertyRequestBodySchema>;

export const CreatePropertyRequestQuerySchema = z.object({});

export type CreatePropertyRequestQuery = z.infer<typeof CreatePropertyRequestQuerySchema>;
