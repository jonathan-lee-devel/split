import bcrypt from 'bcrypt';
import {GenerateSaltFunction} from './generate-salt';

export type EncodePasswordFunction = (
  password: string,
) => Promise<string>;

export const makeEncodePassword = (
    generateSalt: GenerateSaltFunction): EncodePasswordFunction => async (
    password) => bcrypt.hash(password, await generateSalt());

