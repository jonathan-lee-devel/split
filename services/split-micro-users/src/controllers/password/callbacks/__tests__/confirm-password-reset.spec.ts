import {expect} from '@jest/globals';
import {PasswordResetStatus} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';

import {makeConfirmPasswordResetCallback} from '../confirm-password-reset';


describe('Confirm Password Reset Callback Unit Tests', () => {
  const tokenValue = '12345';
  it('When make confirm password reset Then defined function', async () => {
    const confirmPasswordReset = makeConfirmPasswordResetCallback(
        // @ts-ignore
        {},
        // @ts-ignore
        {},
        {},
        () => {},
    );

    expect(confirmPasswordReset).toBeDefined();
    expect(confirmPasswordReset).toBeInstanceOf(Function);
  });
  it('When confirm password reset And token not found Then correct status', async () => {
    const confirmPasswordReset = makeConfirmPasswordResetCallback(
        // @ts-ignore
        {},
        {
          // @ts-ignore
          findOne: () => {
            return {
              exec: () => undefined,
            };
          },
        },
        {},
        () => {},
    );

    let returnedStatusCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await confirmPasswordReset({body: {tokenValue, password: 'password', confirmPassword: 'password'}},
        {status: (code) => {
          returnedStatusCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedStatusCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.INVALID_TOKEN]});
  });
  it('When confirm password reset And user not found Then messaged logged and correct status', async () => {
    let loggedMessage: string | undefined;
    const confirmPasswordReset = makeConfirmPasswordResetCallback(
        // @ts-ignore
        {
          // @ts-ignore
          error: (message) => {
            loggedMessage = message;
          },
        },
        {
          // @ts-ignore
          findOne: () => {
            return {
              exec: () => {
                return {};
              },
            };
          },
        },
        {
          findOne: () => {
            return {
              exec: () => {
                return undefined;
              },
            };
          },
        },
        () => {},
    );

    let returnedStatusCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await confirmPasswordReset({body: {tokenValue, password: 'password', confirmPassword: 'password'}},
        {status: (code) => {
          returnedStatusCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedStatusCode).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.FAILURE]});
    expect(loggedMessage).toStrictEqual(`No user exists for token with value: ${tokenValue}`);
  });
  it('When confirm password reset And token not found Then correct status', async () => {
    const confirmPasswordReset = makeConfirmPasswordResetCallback(
        // @ts-ignore
        {},
        {
          // @ts-ignore
          findOne: () => {
            return {
              exec: () => {
                return {
                  expiryDate: {
                    getTime: () => -10_000,
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
                return {};
              },
            };
          },
        },
        () => {},
    );

    let returnedStatusCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await confirmPasswordReset({body: {tokenValue, password: 'password', confirmPassword: 'password'}},
        {status: (code) => {
          returnedStatusCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedStatusCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.EMAIL_VERIFICATION_EXPIRED]});
  });
  it('When confirm password reset And token not found Then correct status', async () => {
    const confirmPasswordReset = makeConfirmPasswordResetCallback(
        // @ts-ignore
        {},
        {
          // @ts-ignore
          findOne: () => {
            return {
              exec: () => {
                return {
                  expiryDate: {
                    getTime: () => Number.MAX_VALUE,
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
                return {};
              },
            };
          },
        },
        () => {},
    );

    let returnedStatusCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await confirmPasswordReset({body: {tokenValue, password: 'password', confirmPassword: 'password1'}},
        {status: (code) => {
          returnedStatusCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedStatusCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedBody).toStrictEqual({error: 'Passwords do not match'});
  });
  it('When confirm password reset And token not found Then correct status', async () => {
    const password = 'password';
    let isTokenSaveCalled = false;
    let isEncodePasswordCalled = false;
    let isUserSaveCalled = false;
    const confirmPasswordReset = makeConfirmPasswordResetCallback(
        // @ts-ignore
        {},
        {
          // @ts-ignore
          findOne: () => {
            return {
              exec: () => {
                return {
                  expiryDate: {
                    getTime: () => Number.MAX_VALUE,
                  },
                  save: () => {
                    isTokenSaveCalled = true;
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
                  save: () => {
                    isUserSaveCalled = true;
                  },
                };
              },
            };
          },
        },
        () => {
          isEncodePasswordCalled = true;
        },
    );

    let returnedStatusCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await confirmPasswordReset({body: {tokenValue, password, confirmPassword: password}},
        {status: (code) => {
          returnedStatusCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedStatusCode).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.SUCCESS]});
    expect(isTokenSaveCalled).toBeTruthy();
    expect(isUserSaveCalled).toBeTruthy();
    expect(isEncodePasswordCalled).toBeTruthy();
  });
});
