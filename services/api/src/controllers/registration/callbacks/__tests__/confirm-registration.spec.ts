import {makeConfirmRegistrationCallback} from '../confirm-registration';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {RegistrationStatus} from '../../../../lib/enums/registration/RegistrationStatus';

describe('Confirm Registration Callback Unit Tests', () => {
  it('When make confirm registration Then defined function', async () => {
    const confirmRegistration = makeConfirmRegistrationCallback(
        // @ts-ignore
        {},
        {},
        {},
    );

    expect(confirmRegistration).toBeDefined();
    expect(confirmRegistration).toBeInstanceOf(Function);
  });
  it('When confirm registration And token not found Then bad request with correct status', async () => {
    const confirmRegistration = makeConfirmRegistrationCallback(
        // @ts-ignore
        {},
        {},
        {
          findOne: () => {
            return {
              exec: () => undefined,
            };
          },
        },
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await confirmRegistration({body: {tokenValue: '12345'}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }},
    );

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedBody).toStrictEqual({status: RegistrationStatus[RegistrationStatus.INVALID_TOKEN]});
  });
  it('When confirm registration And user not found Then return correct status', async () => {
    let loggedMessage: string | undefined;
    const email = 'test@example.com';
    const confirmRegistration = makeConfirmRegistrationCallback(
        // @ts-ignore
        {
          // @ts-ignore
          error: (message) => {
            loggedMessage = message;
          },
        },
        {
          findOne: () => {
            return {
              exec: () => undefined,
            };
          },
        },
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  userEmail: email,
                };
              },
            };
          },
        },
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await confirmRegistration({body: {tokenValue: '12345'}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }},
    );

    expect(returnedCode).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(returnedBody).toStrictEqual({status: RegistrationStatus[RegistrationStatus.FAILURE]});
    expect(loggedMessage).toStrictEqual(`No user found for registration verification token with userEmail: <${email}>`);
  });
  it('When confirm registration And user already verified Then return correct status', async () => {
    let loggedMessage: string | undefined;
    const email = 'test@example.com';
    const confirmRegistration = makeConfirmRegistrationCallback(
        // @ts-ignore
        {
        // @ts-ignore
          error: (message) => {
            loggedMessage = message;
          },
        },
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  emailVerified: true,
                };
              },
            };
          },
        },
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  userEmail: email,
                };
              },
            };
          },
        },
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await confirmRegistration({body: {tokenValue: '12345'}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }},
    );

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedBody).toStrictEqual({status: RegistrationStatus[RegistrationStatus.EMAIL_ALREADY_VERIFIED]});
    expect(loggedMessage).toStrictEqual(`User found for registration verification token with userEmail: <${email}> already verified`);
  });
  it('When confirm registration And token expired Then return correct status', async () => {
    const email = 'test@example.com';
    const confirmRegistration = makeConfirmRegistrationCallback(
        // @ts-ignore
        {},
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  emailVerified: false,
                };
              },
            };
          },
        },
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  userEmail: email,
                  expiryDate: {
                    getTime: () => 0,
                  },
                };
              },
            };
          },
        },
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await confirmRegistration({body: {tokenValue: '12345'}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }},
    );

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedBody).toStrictEqual({status: RegistrationStatus[RegistrationStatus.EMAIL_VERIFICATION_EXPIRED]});
  });
  it('When confirm registration Then return correct status', async () => {
    const email = 'test@example.com';
    let isUserSaveCalled = false;
    let isTokenSaveCalled = false;
    let loggedMessage: string | undefined;
    const confirmRegistration = makeConfirmRegistrationCallback(
        // @ts-ignore
        {
          // @ts-ignore
          info: (message) => {
            loggedMessage = message;
          },
        },
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  emailVerified: false,
                  email,
                  save: () => {
                    isUserSaveCalled = true;
                  },
                };
              },
            };
          },
        },
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  userEmail: email,
                  expiryDate: {
                    getTime: () => new Date().getTime() + 100_000,
                  },
                  save: () => {
                    isTokenSaveCalled = true;
                  },
                };
              },
            };
          },
        },
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await confirmRegistration({body: {tokenValue: '12345'}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }},
    );

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: RegistrationStatus[RegistrationStatus.SUCCESS]});
    expect(isUserSaveCalled).toBeTruthy();
    expect(isTokenSaveCalled).toBeTruthy();
    expect(loggedMessage).toStrictEqual(`Successful registration confirmation for user with e-mail: <${email}>`);
  });
});
