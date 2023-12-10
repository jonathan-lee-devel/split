import {z} from 'zod';
import {loadDotEnv} from '@split-common/split-env';

// Define environment variables schema
const environmentSchema = z.object({
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

// Function to load and parse environment
const loadEnvironment = () => {
  loadDotEnv();
  return environmentSchema.parse(process.env);
};

export const environment = loadEnvironment();
export type Environment = z.infer<typeof environmentSchema>;
