import {loadDotEnv} from '@split-common/split-env';
import {z} from 'zod';

loadDotEnv();

const environmentVariables = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  FRONT_END_URL: z.string(),
  EMAIL_USER: z.string().email(),
  EMAIL_PASSWORD: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  JWT_SECRET: z.string(),
});

export const environment = environmentVariables.parse(process.env);

export type Environment = z.infer<typeof environmentVariables>;
