import {expect} from '@jest/globals';
import {MailToSendMessage, PASSWORD_RESET_EMAIL_SUBJECT, PasswordResetStatus} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import {RabbitMQConnection} from '@split-common/split-service-config';

import {makeResetPasswordCallback} from '../reset-password';


describe('Reset Password Callback Unit Tests', () => {
  it('When make reset password Then defined function', async () => {
    const resetPassword = makeResetPasswordCallback(
        // @ts-ignore
        {},
        // @ts-ignore
        {},
        {},
        () => {
        },
        () => {
        },
        {},
    );

    expect(resetPassword).toBeDefined();
    expect(resetPassword).toBeInstanceOf(Function);
  });
  it('When reset password And user not found Then correct status', async () => {
    const resetPassword = makeResetPasswordCallback(
        // @ts-ignore
        {},
        // @ts-ignore
        {
          // @ts-ignore
          findOne: () => {
            return {
              exec: () => {
                return undefined;
              },
            };
          },
        },
        {},
        () => {
        },
        () => {
        },
        {},
    );

    const email = 'test@example.com';
    let returnedStatus: number | undefined;
    let returnedBody: any;
    await resetPassword(
        // @ts-ignore
        {body: {email}},
        {
          status: (code) => {
            returnedStatus = code;
            return {
              json: (body) => {
                returnedBody = body;
              },
            };
          },
        });

    expect(returnedStatus).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
  });
  it('When reset password And token not found Then message logged and correct status', async () => {
    let loggedMessage: string | undefined;
    const rabbitMQConnectionPromise = new Promise<RabbitMQConnection<MailToSendMessage>>((resolve) => {
      // @ts-ignore
      resolve({
        sendData: async () => {
        },
      });
    });
    const tokenValue = '12345';
    const resetPassword = makeResetPasswordCallback(
        // @ts-ignore
        {
        // @ts-ignore
          error: (message) => {
            loggedMessage = message;
          },
        },
        // @ts-ignore
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
        () => tokenValue,
        rabbitMQConnectionPromise,
        {
          FRONT_END_URL: 'http://localhost:4200',
        },
    );

    const email = 'test@example.com';
    let returnedStatus: number | undefined;
    let returnedBody: any;
    await resetPassword(
        // @ts-ignore
        {body: {email}},
        {
          status: (code) => {
            returnedStatus = code;
            return {
              json: (body) => {
                returnedBody = body;
              },
            };
          },
        });

    expect(returnedStatus).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
    expect(loggedMessage).toStrictEqual(`Password reset verification token does not exist for user: <${email}>`);
  });
  it('When reset password Then e-mail sent and correct status', async () => {
    let isTokenDeleted = false;
    const tokenValue = '12345';
    let sentQueueName: string | undefined;
    let sentTo: string | undefined;
    let sentSubject: string | undefined;
    let sentHtml: string | undefined;
    const frontEndUrl = 'http://localhost:4200';
    const rabbitMQConnectionPromise = new Promise<RabbitMQConnection<MailToSendMessage>>((resolve) => {
      // @ts-ignore
      resolve({
        sendData: async (queueName: string, data: MailToSendMessage) => {
          sentQueueName = queueName;
          sentTo = data.toEmail;
          sentSubject = data.subject;
          sentHtml = data.html;
        },
      });
    });
    const resetPassword = makeResetPasswordCallback(
        // @ts-ignore
        {},
        // @ts-ignore
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
                return {};
              },
            };
          },
          deleteOne: () => {
            isTokenDeleted = true;
            return {
              exec: () => {
              },
            };
          },
        },
        () => {
          return {
            value: tokenValue,
          };
        },
        rabbitMQConnectionPromise,
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
        {
          status: (code) => {
            returnedStatus = code;
            return {
              json: (body) => {
                returnedBody = body;
              },
            };
          },
        });

    expect(returnedStatus).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
    expect(isTokenDeleted).toBeTruthy();
    expect(sentQueueName).toStrictEqual('mail-to-send');
    expect(sentTo).toStrictEqual(email);
    expect(sentSubject).toStrictEqual(PASSWORD_RESET_EMAIL_SUBJECT);
    expect(sentHtml).toStrictEqual(`<h4>Please click the following link to reset your password: <a href="${frontEndUrl}/reset-password/confirm/${tokenValue}">Reset Password</a></h4>`);
  });
  it('When reset password And e-mail not sent Then message logged and correct status', async () => {
    let isTokenDeleted = false;
    const tokenValue = '12345';
    let loggedMessage: string | undefined;
    const rabbitMQConnectionPromise = new Promise<RabbitMQConnection<MailToSendMessage>>((resolve) => {
      // @ts-ignore
      resolve({
        sendData: async () => {
          throw new Error('Test Error');
        },
      });
    });

    const resetPassword = makeResetPasswordCallback(
    // @ts-ignore
        {
          // @ts-ignore
          error: (message) => {
            loggedMessage = message;
          },
        },
        // @ts-ignore
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
                return {};
              },
            };
          },
          deleteOne: () => {
            isTokenDeleted = true;
            return {
              exec: () => {
              },
            };
          },
        },
        () => {
          return {
            value: tokenValue,
          };
        },
        rabbitMQConnectionPromise,
        {},
    );

    const email = 'test@example.com';
    let returnedStatus: number | undefined;
    let returnedBody: any;
    await resetPassword(
    // @ts-ignore
        {body: {email}},
        {
          status: (code) => {
            returnedStatus = code;
            return {
              json: (body) => {
                returnedBody = body;
              },
            };
          },
        });

    expect(returnedStatus).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
    expect(isTokenDeleted).toBeTruthy();
    expect(loggedMessage).toStrictEqual(`Error while trying to send e-mail to queue: Error: Test Error`);
  });
})
;
