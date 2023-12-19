import {expect} from '@jest/globals';

import {EmailSendAttempt} from '../models';
import {makeSendMail} from '../send-mail';

describe('Send Mail Util Unit Tests', () => {
  const emailUser = 'test@example.com';
  it('When make send mail Then defined function', async () => {
    const sendMail = makeSendMail(
        // @ts-ignore
        {},
        emailUser,
        // @ts-ignore
        {},
        () => undefined,
        {},
    );

    expect(sendMail).toBeDefined();
    expect(sendMail).toBeInstanceOf(Function);
  });
  it('When send mail Then email send attempt saved with correct values', async () => {
    const emailUser = 'test@example.com';
    const emailSendAttempt: EmailSendAttempt = {id: '', from: '', to: '', subject: '', html: '', isSentSuccessfully: false};
    const id = '12345';
    const sendMail = makeSendMail(
        // @ts-ignore
        {info: () => {}, error: () => {}},
        // @ts-ignore
        emailUser,
        {create: async (doc: any) => {
          emailSendAttempt.id = doc.id;
          emailSendAttempt.from = doc.from;
          emailSendAttempt.to = doc.to;
          emailSendAttempt.subject = doc.subject;
          emailSendAttempt.html = doc.html;
          emailSendAttempt.isSentSuccessfully = doc.isSentSuccessfully;
        }},
        () => id,
        {sendMail: async () => {
        }},
    );

    const to = 'another@example.com';
    const subject = 'Test Subject';
    const html = '<h1>Hello, World!</h1>';
    const isSentSuccessfully = false;

    await sendMail(to, subject, html);

    expect(emailSendAttempt).toStrictEqual({id, from: `Split.Direct <${emailUser}>`, to, subject, html, isSentSuccessfully});
  });
  it('When send mail and transporter throws error Then error caught and logged and is sent successfully false', async () => {
    const emailUser = 'test@example.com';
    const id = '12345';
    const emailSendAttempt: EmailSendAttempt = {id: '', from: '', to: '', subject: '', html: '', isSentSuccessfully: false};
    const errorMessages: string[] = [];
    const sendMail = makeSendMail(
        // @ts-ignore
        {info: () => {}, error: (errMessage: any) => {
          errorMessages.push(errMessage);
        }},
        emailUser,
        // @ts-ignore
        {create: async (doc: any) => {
          emailSendAttempt.id = doc.id;
          emailSendAttempt.from = doc.from;
          emailSendAttempt.to = doc.to;
          emailSendAttempt.subject = doc.subject;
          emailSendAttempt.html = doc.html;
          emailSendAttempt.isSentSuccessfully = doc.isSentSuccessfully;
        }},
        () => id,
        {sendMail: async () => {
          throw new Error(`Invalid recipient`);
        }},
    );

    const to = 'another@example.com';
    const subject = 'Test Subject';
    const html = '<h1>Hello, World!</h1>';

    await sendMail(to, subject, html);
    expect(emailSendAttempt.isSentSuccessfully).toBeFalsy();
    expect(errorMessages[0]).toStrictEqual(`Error occurred while sending mail attempt ID: ${emailSendAttempt.id} : Error: Invalid recipient`);
    expect(errorMessages[1]).toStrictEqual(`Failed to send e-mail to: <${to}> (response: null) with attempt ID: ${emailSendAttempt.id}`);
  });
  it('When send mail Then email send attempt saved with correct values and correct message logged and is saved', async () => {
    const emailUser = 'test@example.com';
    const emailSendAttempt: EmailSendAttempt = {id: '', from: '', to: '', subject: '', html: '', isSentSuccessfully: false};
    const id = '12345';
    const loggedInfoMessages: string[] = [];
    let isSaveCalled = false;
    const sendMail = makeSendMail(
        // @ts-ignore
        {info: (message) => {
          loggedInfoMessages.push(message);
          // @ts-ignore
        }, error: () => {}},
        emailUser,
        // @ts-ignore
        {create: async (doc: any) => {
          emailSendAttempt.id = doc.id;
          emailSendAttempt.from = doc.from;
          emailSendAttempt.to = doc.to;
          emailSendAttempt.subject = doc.subject;
          emailSendAttempt.html = doc.html;
          emailSendAttempt.isSentSuccessfully = doc.isSentSuccessfully;
          return {
            ...emailSendAttempt,
            save: async () => {
              isSaveCalled = true;
            },
          };
        }},
        () => id,
        {sendMail: async (mailOptions) => {
          return {
            accepted: [mailOptions.to],
          };
        }},
    );

    const to = 'another@example.com';
    const subject = 'Test Subject';
    const html = '<h1>Hello, World!</h1>';
    const isSentSuccessfully = false;

    await sendMail(to, subject, html);

    expect(emailSendAttempt).toStrictEqual({id, from: `Split.Direct <${emailUser}>`, to, subject, html, isSentSuccessfully});
    expect(loggedInfoMessages[1]).toStrictEqual(`Successfully sent e-mail to: <${to}> with attempt ID: ${emailSendAttempt.id}`);
    expect(isSaveCalled).toBeTruthy();
  });
  it('When send mail And not accepted Then correct message logged', async () => {
    const emailUser = 'test@example.com';
    const emailSendAttempt: EmailSendAttempt = {id: '', from: '', to: '', subject: '', html: '', isSentSuccessfully: false};
    const id = '12345';
    const loggedErrorMessages: string[] = [];
    let isSaveCalled = false;
    const sendMail = makeSendMail(
        // @ts-ignore
        {info: () => {
          // @ts-ignore
        }, error: (message) => {
          loggedErrorMessages.push(message);
        }},
        emailUser,
        // @ts-ignore
        {create: async (doc: any) => {
          emailSendAttempt.id = doc.id;
          emailSendAttempt.from = doc.from;
          emailSendAttempt.to = doc.to;
          emailSendAttempt.subject = doc.subject;
          emailSendAttempt.html = doc.html;
          emailSendAttempt.isSentSuccessfully = doc.isSentSuccessfully;
          return {
            ...emailSendAttempt,
            save: async () => {
              isSaveCalled = true;
            },
          };
        }},
        () => id,
        {sendMail: async (mailOptions) => {
          return {
            accepted: [],
          };
        }},
    );

    const to = 'another@example.com';
    const subject = 'Test Subject';
    const html = '<h1>Hello, World!</h1>';

    await sendMail(to, subject, html);
    expect(loggedErrorMessages[loggedErrorMessages.length - 1]).toStrictEqual(`Unable to send e-mail to: <${to}> with attempt ID: ${emailSendAttempt.id}`);
    expect(isSaveCalled).toBeFalsy();
  });
});
