import {z} from 'zod';

export const CreatePropertyRequestBodySchema = z.object({
  name: z.string(),
});

export type CreatePropertyRequestBody = z.infer<typeof CreatePropertyRequestBodySchema>;

export const CreatePropertyRequestQuerySchema = z.object({});

export type CreatePropertyRequestQuery = z.infer<typeof CreatePropertyRequestQuerySchema>;
