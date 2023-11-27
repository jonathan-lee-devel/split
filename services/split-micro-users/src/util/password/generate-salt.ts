import bcrypt from 'bcrypt';

export type GenerateSaltFunction = () => Promise<string>;

export const makeGenerateSalt = (): GenerateSaltFunction => async () => new Promise<string>(
    (resolve, reject) => {
      bcrypt.genSalt((err, salt) => {
        if (err) return reject(err);
        return resolve(salt);
      });
    });

