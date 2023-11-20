import {z} from 'zod';

export const IndexHealthCheckRequestBodySchema = z.object({});

export type IndexHealthCheckRequestBody = z.infer<typeof IndexHealthCheckRequestBodySchema>;

export const IndexHealthCheckRequestQuerySchema = z.object({});

export type IndexHealthCheckRequestQuery = z.infer<typeof IndexHealthCheckRequestQuerySchema>;
