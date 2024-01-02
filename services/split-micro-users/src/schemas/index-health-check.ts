import {z} from 'zod';

export const indexHealthCheckRequestBodySchema = z.object({});

export type IndexHealthCheckRequestBody = z.infer<typeof indexHealthCheckRequestBodySchema>;

export const indexHealthCheckRequestParamsSchema = z.object({});

export type IndexHealthCheckRequestParams = z.infer<typeof indexHealthCheckRequestParamsSchema>;

export const indexHealthCheckRequestQuerySchema = z.object({});

export type IndexHealthCheckRequestQuery = z.infer<typeof indexHealthCheckRequestQuerySchema>;

export const indexHealthCheckRequestHeadersSchema = z.object({});

export type IndexHealthCheckRequestHeaders = z.infer<typeof indexHealthCheckRequestHeadersSchema>;
