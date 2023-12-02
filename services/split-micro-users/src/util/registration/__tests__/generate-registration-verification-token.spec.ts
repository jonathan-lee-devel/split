import {expect} from '@jest/globals';
import isAfter from 'date-fns/isAfter';
import {DEFAULT_TOKEN_SIZE} from '@split/split-constants';
import {RegistrationVerificationToken} from '@split/split-auth';
import {makeGenerateRegistrationVerificationToken} from '../generate-registration-verification-token';

describe('Generate Registration Verification Token Unit Tests', () => {
  it('When make generate registration verification token Then defined function', async () => {
    const generateRegistrationVerificationToken = makeGenerateRegistrationVerificationToken(
        // @ts-ignore
        {},
        {},
    );

    expect(generateRegistrationVerificationToken).toBeDefined();
    expect(generateRegistrationVerificationToken).toBeInstanceOf(Function);
  });
  it('When generate registration verification token Then token generated, message logged and token returned', async () => {
    let loggedInfoMessage: string | undefined;
    const registrationVerificationToken: RegistrationVerificationToken = {
      value: '',
      userEmail: '',
      expiryDate: new Date(),
    };
    const generateRegistrationVerificationToken = makeGenerateRegistrationVerificationToken(
        // @ts-ignore
        {info: (message) => {
          loggedInfoMessage = message;
        }},
        {
          create: async (doc: any) => {
            registrationVerificationToken.value = doc.value;
            registrationVerificationToken.userEmail = doc.userEmail;
            registrationVerificationToken.expiryDate = doc.expiryDate;
          },
        },
    );

    const userEmail = 'test@example.com';
    const result = await generateRegistrationVerificationToken(userEmail);

    expect(registrationVerificationToken.value.length).toStrictEqual(DEFAULT_TOKEN_SIZE);
    expect(registrationVerificationToken.userEmail).toStrictEqual(userEmail);
    expect(isAfter(registrationVerificationToken.expiryDate, new Date())).toBeTruthy();
    expect(loggedInfoMessage).toStrictEqual(`Generated registration verification token for user with e-mail: <${userEmail}>`);
    expect(result.value.length).toStrictEqual(DEFAULT_TOKEN_SIZE);
    expect(isAfter(result.expiryDate, new Date())).toBeTruthy();
    expect(result.userEmail).toStrictEqual(userEmail);
  });
});
