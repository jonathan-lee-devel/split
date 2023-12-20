import dotenv from 'dotenv';

export const loadDotEnv = () => {
  const result = dotenv.config();
  return (result.error) ? dotenv.config({path: '.env.default'}) : result;
};
