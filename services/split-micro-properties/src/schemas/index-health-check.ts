import {z} from 'zod';

export const indexHealthCheckRequestBodySchema = z.object({});

export type IndexHealthCheckRequestBody = z.infer<typeof indexHealthCheckRequestBodySchema>;

export const indexHealthCheckRequestQuerySchema = z.object({});

export type IndexHealthCheckRequestQuery = z.infer<typeof indexHealthCheckRequestQuerySchema>;
