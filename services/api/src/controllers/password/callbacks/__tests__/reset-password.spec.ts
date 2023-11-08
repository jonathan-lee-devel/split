import {makeResetPasswordCallback} from '../reset-password';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {PasswordResetStatus} from '../../../../lib/enums/password/PasswordResetStatus';
import {PASSWORD_RESET_EMAIL_SUBJECT} from '../../../../constants/password/password';

describe('Reset Password Callback Unit Tests', () => {
  it('When make reset password Then defined function', async () => {
    const resetPassword = makeResetPasswordCallback(
        // @ts-ignore
        {},
        {},
        {},
        () => {},
        () => {},
        {},
    );

    expect(resetPassword).toBeDefined();
    expect(resetPassword).toBeInstanceOf(Function);
  });
  it('When reset password And user not found Then correct status', async () => {
    const resetPassword = makeResetPasswordCallback(
        // @ts-ignore
        {},
        {findOne: () => {
          return {
            exec: () => {
              return undefined;
            },
          };
        }},
        {},
        () => {},
        () => {},
        {},
    );

    const email = 'test@example.com';
    let returnedStatus: number | undefined;
    let returnedBody: any;
    await resetPassword(
        // @ts-ignore
        {body: {email}},
        {status: (code) => {
          returnedStatus = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedStatus).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
  });
  it('When reset password And token not found Then message logged and correct status', async () => {
    let loggedMessage: string | undefined;
    const resetPassword = makeResetPasswordCallback(
        // @ts-ignore
        {
          // @ts-ignore
          error: (message) => {
            loggedMessage = message;
          },
        },
        {findOne: () => {
          return {
            exec: () => {
              return {};
            },
          };
        }},
        {findOne: () => {
          return {
            exec: () => {
              return undefined;
            },
          };
        }},
        () => {},
        () => {},
        {},
    );

    const email = 'test@example.com';
    let returnedStatus: number | undefined;
    let returnedBody: any;
    await resetPassword(
        // @ts-ignore
        {body: {email}},
        {status: (code) => {
          returnedStatus = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedStatus).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
    expect(loggedMessage).toStrictEqual(`Password reset verification token does not exist for user: <${email}>`);
  });
  it('When reset password Then e-mail sent and correct status', async () => {
    let isTokenDeleted = false;
    const tokenValue = '12345';
    let sentTo: string | undefined;
    let sentSubject: string | undefined;
    let sentHtml: string | undefined;
    const frontEndUrl = 'http://localhost:4200';
    const resetPassword = makeResetPasswordCallback(
        // @ts-ignore
        {
        },
        {findOne: () => {
          return {
            exec: () => {
              return {};
            },
          };
        }},
        {findOne: () => {
          return {
            exec: () => {
              return {};
            },
          };
        },
        deleteOne: () => {
          isTokenDeleted = true;
          return {
            exec: () => {},
          };
        },
        },
        () => {
          return {
            value: tokenValue,
          };
        },
        async (addressTo, subject, html) => {
          sentTo = addressTo;
          sentSubject = subject;
          sentHtml = html;
        },
        {
          FRONT_END_URL: frontEndUrl,
        },
    );

    const email = 'test@example.com';
    let returnedStatus: number | undefined;
    let returnedBody: any;
    await resetPassword(
        // @ts-ignore
        {body: {email}},
        {status: (code) => {
          returnedStatus = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedStatus).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
    expect(isTokenDeleted).toBeTruthy();
    expect(sentTo).toStrictEqual(email);
    expect(sentSubject).toStrictEqual(PASSWORD_RESET_EMAIL_SUBJECT);
    expect(sentHtml).toStrictEqual(`<h4>Please click the following link to reset your password: <a href="${frontEndUrl}/reset-password/confirm/${tokenValue}">Reset Password</a></h4>`);
  });
  it('When reset password And e-mail not sent Then message logged and correct status', async () => {
    let isTokenDeleted = false;
    const tokenValue = '12345';
    let loggedMessage: string | undefined;
    const resetPassword = makeResetPasswordCallback(
        // @ts-ignore
        {
          // @ts-ignore
          error: (message) => {
            loggedMessage = message;
          },
        },
        {findOne: () => {
          return {
            exec: () => {
              return {};
            },
          };
        }},
        {findOne: () => {
          return {
            exec: () => {
              return {};
            },
          };
        },
        deleteOne: () => {
          isTokenDeleted = true;
          return {
            exec: () => {},
          };
        },
        },
        () => {
          return {
            value: tokenValue,
          };
        },
        async () => {
          throw new Error('Test Error');
        },
        {},
    );

    const email = 'test@example.com';
    let returnedStatus: number | undefined;
    let returnedBody: any;
    await resetPassword(
        // @ts-ignore
        {body: {email}},
        {status: (code) => {
          returnedStatus = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedStatus).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
    expect(isTokenDeleted).toBeTruthy();
    expect(loggedMessage).toStrictEqual(`An error has occurred while sending mail: Error: Test Error`);
  });
});
