import {makeEncodePassword} from '../encode-password';
import bcrypt from 'bcrypt';

describe('Encode Password Unit Tests', () => {
  it('When make encode password Then defined function', async () => {
    // @ts-ignore
    const encodePassword = makeEncodePassword(() => {});

    expect(encodePassword).toBeDefined();
    expect(encodePassword).toBeInstanceOf(Function);
  });
  it('When encode password Then generate salt called and hash returned', async () => {
    const salt = '$2b$10$OKx4ZY1nibxs4DrolaY2lu';
    let isGenerateSaltCalled = false;
    const encodePassword = makeEncodePassword(async () => {
      isGenerateSaltCalled = true;
      return salt;
    });

    const password = 'password';
    const result = encodePassword(password);
    expect(result).toStrictEqual(bcrypt.hash(password, salt));
    expect(isGenerateSaltCalled).toBeTruthy();
  });
});
