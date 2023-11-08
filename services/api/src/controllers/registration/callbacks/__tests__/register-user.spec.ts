import {makeRegisterUserCallback} from '../register-user';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {RegistrationStatus} from '../../../../lib/enums/registration/RegistrationStatus';
import {REGISTRATION_CONFIRMATION_EMAIL_SUBJECT} from '../../../../constants/registration/registration';

describe('Register User Callback Unit Tests', () => {
  it('When make register user Then defined function', async () => {
    const registerUser = makeRegisterUserCallback(
        // @ts-ignore
        {},
        () => {},
        () => {},
        () => {},
        () => {},
        {},
        () => {},
        {},
    );

    expect(registerUser).toBeDefined();
    expect(registerUser).toBeInstanceOf(Function);
  });
  it('When register user And existing user Then return conflict', async () => {
    const registerUser = makeRegisterUserCallback(
        // @ts-ignore
        {},
        () => true,
        () => {},
        () => {},
        () => {},
        {},
        () => {},
        {},
    );

    const email = 'test@example.com';
    const firstName = 'John';
    const lastName = 'Doe';
    const password = 'password';
    const confirmPassword = password;
    const acceptTermsAndConditions = true;
    let returnedCode: number | undefined;
    // @ts-ignore
    await registerUser({body: {email, firstName, lastName, password, confirmPassword, acceptTermsAndConditions}},
        {status: (code) => {
          returnedCode = code;
          return {
            send: () => {},
          };
        }});

    expect(returnedCode).toStrictEqual(HttpStatus.CONFLICT);
  });
  it('When register user And passwords do not match Then return correct status', async () => {
    const registerUser = makeRegisterUserCallback(
        // @ts-ignore
        {},
        () => false,
        () => {},
        () => {},
        () => {},
        {},
        () => {},
        {},
    );

    const email = 'test@example.com';
    const firstName = 'John';
    const lastName = 'Doe';
    const password = 'password';
    const confirmPassword = 'anotherPassword';
    const acceptTermsAndConditions = true;
    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await registerUser({body: {email, firstName, lastName, password, confirmPassword, acceptTermsAndConditions}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedBody).toStrictEqual({error: 'Passwords do not match'});
  });
  it('When register user And no existing user Then return correct status', async () => {
    let savedUser: any;
    let userFilter: any;
    let sentTo: string | undefined;
    let sentSubject: string | undefined;
    let sentHtml: string | undefined;
    const frontEndUrl = 'http://localhost:4200';
    const tokenValue = '12345';
    const registerUser = makeRegisterUserCallback(
        // @ts-ignore
        {},
        () => false,
        () => {
          return {value: tokenValue};
        },
        () => {
          return {};
        },
        () => password,
        {findOne: (filter) => {
          userFilter = filter;
          return {
            exec: async () => undefined,
          };
        },
        create: async (user) => {
          savedUser = user;
        }},
        async (to, subject, html) => {
          sentTo = to;
          sentSubject = subject;
          sentHtml = html;
        },
        {
          FRONT_END_URL: frontEndUrl,
        },
    );

    const email = 'test@example.com';
    const firstName = 'John';
    const lastName = 'Doe';
    const password = 'password';
    const confirmPassword = password;
    const acceptTermsAndConditions = true;
    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await registerUser({body: {email, firstName, lastName, password, confirmPassword, acceptTermsAndConditions}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: RegistrationStatus[RegistrationStatus.AWAITING_EMAIL_VERIFICATION]});
    expect(savedUser).toStrictEqual({email, firstName, lastName, password, emailVerified: false, googleId: undefined});
    expect(userFilter).toStrictEqual({email});
    expect(sentTo).toStrictEqual(email);
    expect(sentSubject).toStrictEqual(REGISTRATION_CONFIRMATION_EMAIL_SUBJECT);
    expect(sentHtml).toStrictEqual(`<h4>Please click the following link to verify your account: <a href="${frontEndUrl}/register/confirm/${tokenValue}">Verify Account</a></h4>`);
  });
  it('When register user And existing google user Then return correct status', async () => {
    let userFilter: any;
    let sentTo: string | undefined;
    let sentSubject: string | undefined;
    let sentHtml: string | undefined;
    const frontEndUrl = 'http://localhost:4200';
    const tokenValue = '12345';
    let isExistingUserSaveCalled = false;
    const registerUser = makeRegisterUserCallback(
        // @ts-ignore
        {},
        () => false,
        () => {
          return {value: tokenValue};
        },
        () => {
          return {};
        },
        () => password,
        {findOne: (filter) => {
          userFilter = filter;
          return {
            exec: async () => {
              return {
                firstName: 'anotherFirstName',
                lastName: 'anotherLastName',
                password: undefined,
                save: async () => {
                  isExistingUserSaveCalled = true;
                },
              };
            },
          };
        }},
        async (to, subject, html) => {
          sentTo = to;
          sentSubject = subject;
          sentHtml = html;
        },
        {
          FRONT_END_URL: frontEndUrl,
        },
    );

    const email = 'test@example.com';
    const firstName = 'John';
    const lastName = 'Doe';
    const password = 'password';
    const confirmPassword = password;
    const acceptTermsAndConditions = true;
    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await registerUser({body: {email, firstName, lastName, password, confirmPassword, acceptTermsAndConditions}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: RegistrationStatus[RegistrationStatus.AWAITING_EMAIL_VERIFICATION]});
    expect(userFilter).toStrictEqual({email});
    expect(sentTo).toStrictEqual(email);
    expect(sentSubject).toStrictEqual(REGISTRATION_CONFIRMATION_EMAIL_SUBJECT);
    expect(sentHtml).toStrictEqual(`<h4>Please click the following link to verify your account: <a href="${frontEndUrl}/register/confirm/${tokenValue}">Verify Account</a></h4>`);
    expect(isExistingUserSaveCalled).toBeTruthy();
  });
  it('When register user And token is null Then log message return correct status', async () => {
    let userFilter: any;
    let isExistingUserSaveCalled = false;
    let loggedMessage: string | undefined;
    const registerUser = makeRegisterUserCallback(
        // @ts-ignore
        {
          // @ts-ignore
          error: (message) => {
            loggedMessage = message;
          },
        },
        () => false,
        () => undefined,
        () => undefined,
        () => password,
        {findOne: (filter) => {
          userFilter = filter;
          return {
            exec: async () => {
              return {
                firstName: 'anotherFirstName',
                lastName: 'anotherLastName',
                password: undefined,
                save: async () => {
                  isExistingUserSaveCalled = true;
                },
              };
            },
          };
        }},
        async () => {
        },
        {
        },
    );

    const email = 'test@example.com';
    const firstName = 'John';
    const lastName = 'Doe';
    const password = 'password';
    const confirmPassword = password;
    const acceptTermsAndConditions = true;
    let returnedCode: number | undefined;
    // @ts-ignore
    await registerUser({body: {email, firstName, lastName, password, confirmPassword, acceptTermsAndConditions}},
        {status: (code) => {
          returnedCode = code;
          return {send: () => {}};
        }});

    expect(returnedCode).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(userFilter).toStrictEqual({email});
    expect(isExistingUserSaveCalled).toBeTruthy();
    expect(loggedMessage).toStrictEqual(`Error generating verification token for new user with e-mail: <${email}>`);
  });
  it('When register user And send mail returns error Then error logged', async () => {
    let userFilter: any;
    const frontEndUrl = 'http://localhost:4200';
    const tokenValue = '12345';
    let isExistingUserSaveCalled = false;
    const errorMessage = 'Test Error Message';
    let loggedMessage: string | undefined;
    const registerUser = makeRegisterUserCallback(
        // @ts-ignore
        {
          // @ts-ignore
          error: (message) => {
            loggedMessage = message;
          },
        },
        () => false,
        () => {
          return {value: tokenValue};
        },
        () => {
          return {};
        },
        () => password,
        {findOne: (filter) => {
          userFilter = filter;
          return {
            exec: async () => {
              return {
                firstName: 'anotherFirstName',
                lastName: 'anotherLastName',
                password: undefined,
                save: async () => {
                  isExistingUserSaveCalled = true;
                },
              };
            },
          };
        }},
        async (to, subject, html) => {
          throw new Error(errorMessage);
        },
        {
          FRONT_END_URL: frontEndUrl,
        },
    );

    const email = 'test@example.com';
    const firstName = 'John';
    const lastName = 'Doe';
    const password = 'password';
    const confirmPassword = password;
    const acceptTermsAndConditions = true;
    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await registerUser({body: {email, firstName, lastName, password, confirmPassword, acceptTermsAndConditions}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: RegistrationStatus[RegistrationStatus.AWAITING_EMAIL_VERIFICATION]});
    expect(userFilter).toStrictEqual({email});
    expect(isExistingUserSaveCalled).toBeTruthy();
    expect(loggedMessage).toStrictEqual(`Error sending e-mail: Error: ${errorMessage}`);
  });
});
