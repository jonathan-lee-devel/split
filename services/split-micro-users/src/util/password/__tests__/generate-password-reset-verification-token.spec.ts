import {expect} from '@jest/globals';
import {makeGeneratePasswordResetVerificationToken} from '../generate-password-reset-verification-token';
import {PasswordResetVerificationToken} from '../../../models/users/password/PasswordResetVerificationToken';
import {DEFAULT_TOKEN_SIZE} from '../../../constants/token/token';
import isAfter from 'date-fns/isAfter';

describe('Generate Password Reset Verification Token Unit Tests', () => {
  it('When make generate password reset verification token Then defined function', async () => {
    const generatePasswordResetVerificationToken = makeGeneratePasswordResetVerificationToken(
        // @ts-ignore
        {},
        {},
    );

    expect(generatePasswordResetVerificationToken).toBeDefined();
    expect(generatePasswordResetVerificationToken).toBeInstanceOf(Function);
  });
  it('When generate password reset verification token Then token generated, message logged and token returned', async () => {
    let loggedInfoMessage: string | undefined;
    const passwordResetVerificationToken: PasswordResetVerificationToken = {
      value: '',
      userEmail: '',
      expiryDate: new Date(),
    };
    const generatePasswordResetVerificationToken = makeGeneratePasswordResetVerificationToken(
        // @ts-ignore
        {info: (message) => {
          loggedInfoMessage = message;
        }},
        {
          create: async (doc: any) => {
            passwordResetVerificationToken.value = doc.value;
            passwordResetVerificationToken.userEmail = doc.userEmail;
            passwordResetVerificationToken.expiryDate = doc.expiryDate;
          },
        },
    );

    const userEmail = 'test@example.com';
    const result = await generatePasswordResetVerificationToken(userEmail);

    expect(passwordResetVerificationToken.value.length).toStrictEqual(DEFAULT_TOKEN_SIZE);
    expect(passwordResetVerificationToken.userEmail).toStrictEqual(userEmail);
    expect(isAfter(passwordResetVerificationToken.expiryDate, new Date())).toBeTruthy();
    expect(loggedInfoMessage).toStrictEqual(`Generated password reset verification token for user with e-mail: <${userEmail}>`);
    expect(result.value.length).toStrictEqual(DEFAULT_TOKEN_SIZE);
    expect(isAfter(result.expiryDate, new Date())).toBeTruthy();
    expect(result.userEmail).toStrictEqual(userEmail);
  });
});
