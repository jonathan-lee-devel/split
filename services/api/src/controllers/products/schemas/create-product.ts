import {z} from 'zod';
import {DEFAULT_ID_LENGTH} from '../../../constants/auth';
import {MAX_PRODUCT_NAME_LENGTH, MIN_PRODUCT_NAME_LENGTH} from '../../../constants/products/field-constraints';

export const CreateProductRequestBodySchema = z.object({
  name: z.string().min(MIN_PRODUCT_NAME_LENGTH).max(MAX_PRODUCT_NAME_LENGTH),
  organizationId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
  priceAmount: z.number().int(),
  priceCurrency: z.string(),
});

export type CreateProductRequestBody = z.infer<typeof CreateProductRequestBodySchema>;

export const CreateProductRequestQuerySchema = z.object({});

export type CreateProductRequestQuery = z.infer<typeof CreateProductRequestQuerySchema>;
