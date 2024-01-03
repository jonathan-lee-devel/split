import bcrypt, {genSalt} from 'bcrypt';

export const makePasswordService = (
) => {
  return {
    encodePassword: async (password: string) => {
      return bcrypt.hash(password, await genSalt());
    },
  };
};
