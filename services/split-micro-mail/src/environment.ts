import dotenv from 'dotenv';
import {z} from 'zod';

const result = dotenv.config();
if (result.error) {
  dotenv.config({path: '.env.default'});
}

const environmentVariables = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  FRONT_END_URL: z.string().url(),
  EMAIL_USER: z.string().email(),
  EMAIL_PASSWORD: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string().url(),
  JWT_SECRET: z.string(),
  DATADOG_API_KEY: z.string(),
  RABBITMQ_URL: z.string().url(),
});

export const environment = environmentVariables.parse(process.env);

export type Environment = z.infer<typeof environmentVariables>;
