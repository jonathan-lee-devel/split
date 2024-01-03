import {z} from 'zod';

export const NodeEnvZodUnion = [z.literal('production'), z.literal('staging'), z.literal('development')] as const;

export type NodeEnvValue = 'production' | 'staging' | 'development';
