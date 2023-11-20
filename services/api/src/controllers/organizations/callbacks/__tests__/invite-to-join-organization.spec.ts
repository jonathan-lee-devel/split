import {expect} from '@jest/globals';
import {makeInviteToJoinOrganizationCallback} from '../invite-to-join-organization';
import {User} from '../../../../models/users/User';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {ORGANIZATION_INVITATION_EMAIL_SUBJECT} from '../../../../constants/organizations/email-constants';
import {OrganizationInvitationStatus} from '../../../../lib/enums/organization/OrganizationInvitationStatus';

describe('Invite to Join Organization Callback Unit Tests', () => {
  const user: User = {
    email: 'test@example.com',
    emailVerified: true,
    firstName: 'John',
    lastName: 'Doe',
    googleId: undefined,
    password: undefined,
  };
  const emailToInvite = 'another@example.com';
  const organizationId = '12345';
  it('When make invite to join organization Then defined function', async () => {
    const inviteToJoinOrganization = makeInviteToJoinOrganizationCallback(
        // @ts-ignore
        {},
        {},
        {},
        () => {},
        () => {},
        {},
    );

    expect(inviteToJoinOrganization).toBeDefined();
    expect(inviteToJoinOrganization).toBeInstanceOf(Function);
  });
  it('When organization does not exist Then correct status, error returned, and message logged', async () => {
    let loggedMessage: string | undefined;
    const inviteToJoinOrganization = makeInviteToJoinOrganizationCallback(
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
              exec: () => undefined,
            };
          },
        },
        {},
        () => {},
        () => {},
        {},
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await inviteToJoinOrganization({user, params: {organizationId}, body: {emailToInvite}}, {
      status(code: number) {
        returnedCode = code;
        return {
          json: (body) => {
            returnedBody = body;
          },
        };
      },
    });

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedBody).toStrictEqual({error: `Organization with ID: ${organizationId} does not exist`});
    expect(loggedMessage).toStrictEqual(`Request from <${user.email}> to invite: ${emailToInvite} to organization with ID: ${organizationId}`);
  });
  it('When organization administrators does not include requesting user e-mail Then correct status, error returned, and message logged', async () => {
    let loggedMessage: string | undefined;
    const inviteToJoinOrganization = makeInviteToJoinOrganizationCallback(
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
                  administratorEmails: [],
                };
              },
            };
          },
        },
        {},
        () => {},
        () => {},
        {},
    );

    let returnedCode: number | undefined;
    // @ts-ignore
    await inviteToJoinOrganization({user, params: {organizationId}, body: {emailToInvite}}, {
      status(code: number) {
        returnedCode = code;
        return {
          send: () => {},
        };
      },
    });

    expect(returnedCode).toStrictEqual(HttpStatus.FORBIDDEN);
    expect(loggedMessage).toStrictEqual(`Request from <${user.email}> to invite: ${emailToInvite} to organization with ID: ${organizationId}`);
  });
  it('When organization members already includes e-mail to invite Then correct status, error returned, and message logged', async () => {
    let loggedMessage: string | undefined;
    const inviteToJoinOrganization = makeInviteToJoinOrganizationCallback(
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
                  administratorEmails: [user.email],
                  memberEmails: [emailToInvite],
                };
              },
            };
          },
        },
        {},
        () => {},
        () => {},
        {},
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await inviteToJoinOrganization({user, params: {organizationId}, body: {emailToInvite}}, {
      status(code: number) {
        returnedCode = code;
        return {
          json: (body) => {
            returnedBody = body;
          },
        };
      },
    });

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedBody).toStrictEqual({error: `Organization with ID: ${organizationId} already has member: ${emailToInvite}`});
    expect(loggedMessage).toStrictEqual(`Request from <${user.email}> to invite: ${emailToInvite} to organization with ID: ${organizationId}`);
  });
  it('When organization invitation exists Then correct status, error returned, and message logged', async () => {
    let loggedMessage: string | undefined;
    const inviteToJoinOrganization = makeInviteToJoinOrganizationCallback(
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
                  administratorEmails: [user.email],
                  memberEmails: [],
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
                  expiryDate: {
                    getTime: () => Number.MAX_VALUE,
                  },
                };
              },
            };
          },
        },
        () => {},
        () => {},
        {},
    );

    let returnedCode: number | undefined;
    // @ts-ignore
    await inviteToJoinOrganization({user, params: {organizationId}, body: {emailToInvite}}, {
      status(code: number) {
        returnedCode = code;
        return {
          send: () => {},
        };
      },
    });

    expect(returnedCode).toStrictEqual(HttpStatus.CONFLICT);
    expect(loggedMessage).toStrictEqual(`Request from <${user.email}> to invite: ${emailToInvite} to organization with ID: ${organizationId}`);
  });
  it('When sent e-mail Then correct status, status returned, and messages logged', async () => {
    const loggedMessages: string[] = [];
    const generatedId = '12345';
    const frontEndUrl = 'http://localhost:4200';
    let sentTo: string | undefined;
    let sentSubject: string | undefined;
    let sentHtml: string | undefined;
    let createdBody: any;
    const inviteToJoinOrganization = makeInviteToJoinOrganizationCallback(
        // @ts-ignore
        {
        // @ts-ignore
          info: (message) => {
            loggedMessages.push(message);
          },
        },
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  administratorEmails: [user.email],
                  memberEmails: [],
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
                  expiryDate: {
                    getTime: () => Number.MIN_VALUE,
                  },
                };
              },
            };
          },
          create: async (body) => {
            createdBody = body;
          },
        },
        () => generatedId,
        async (addressTo, subject, html) => {
          sentTo = addressTo;
          sentSubject = subject;
          sentHtml = html;
        },
        {
          FRONT_END_URL: frontEndUrl,
        },
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await inviteToJoinOrganization({user, params: {organizationId}, body: {emailToInvite}}, {
      status(code: number) {
        returnedCode = code;
        return {
          json: (body) => {
            returnedBody = body;
          },
        };
      },
    });

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: OrganizationInvitationStatus[OrganizationInvitationStatus.AWAITING_RESPONSE]});
    expect(sentTo).toStrictEqual(emailToInvite);
    expect(sentSubject).toStrictEqual(ORGANIZATION_INVITATION_EMAIL_SUBJECT);
    expect(sentHtml).toStrictEqual(`<h3>You have been invited to join an organization</h3>
<p>Click the following link to view an invitation to join an organization <a href="${frontEndUrl}/organizations/invitations/${generatedId}">View Invitation</a><p>`);
    expect(loggedMessages[0]).toStrictEqual(`Request from <${user.email}> to invite: ${emailToInvite} to organization with ID: ${organizationId}`);
    expect(loggedMessages[1]).toStrictEqual(`Organization invitation sent to e-mail: <${emailToInvite}>`);
    expect(createdBody.id).toStrictEqual(generatedId);
    expect(createdBody.organizationId).toStrictEqual(organizationId);
    expect(createdBody.requestingUserEmail).toStrictEqual(user.email);
    expect(createdBody.isAccepted).toBeFalsy();
    expect(createdBody.value).toStrictEqual(generatedId);
    expect(createdBody.expiryDate.getTime()).toBeGreaterThanOrEqual(new Date().getTime());
    expect(createdBody.emailToInvite).toStrictEqual(emailToInvite);
  });
  it('When sent e-mail And error sending e-mail Then correct status, status returned, and messages logged', async () => {
    const loggedMessages: string[] = [];
    let loggedErrorMessage: string | undefined;
    const generatedId = '12345';
    const frontEndUrl = 'http://localhost:4200';
    let createdBody: any;
    const inviteToJoinOrganization = makeInviteToJoinOrganizationCallback(
        // @ts-ignore
        {
        // @ts-ignore
          info: (message) => {
            loggedMessages.push(message);
          },
          // @ts-ignore
          error: (message) => {
            loggedErrorMessage = message;
          },
        },
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  administratorEmails: [user.email],
                  memberEmails: [],
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
                  expiryDate: {
                    getTime: () => Number.MIN_VALUE,
                  },
                };
              },
            };
          },
          create: async (body) => {
            createdBody = body;
          },
        },
        () => generatedId,
        async () => {
          throw new Error('Test Error');
        },
        {
          FRONT_END_URL: frontEndUrl,
        },
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await inviteToJoinOrganization({user, params: {organizationId}, body: {emailToInvite}}, {
      status(code: number) {
        returnedCode = code;
        return {
          json: (body) => {
            returnedBody = body;
          },
        };
      },
    });

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual({status: OrganizationInvitationStatus[OrganizationInvitationStatus.AWAITING_RESPONSE]});
    expect(loggedMessages[0]).toStrictEqual(`Request from <${user.email}> to invite: ${emailToInvite} to organization with ID: ${organizationId}`);
    expect(loggedMessages[1]).toStrictEqual(`Organization invitation sent to e-mail: <${emailToInvite}>`);
    expect(createdBody.id).toStrictEqual(generatedId);
    expect(createdBody.organizationId).toStrictEqual(organizationId);
    expect(createdBody.requestingUserEmail).toStrictEqual(user.email);
    expect(createdBody.isAccepted).toBeFalsy();
    expect(createdBody.value).toStrictEqual(generatedId);
    expect(createdBody.expiryDate.getTime()).toBeGreaterThanOrEqual(new Date().getTime());
    expect(createdBody.emailToInvite).toStrictEqual(emailToInvite);
    expect(loggedErrorMessage).toStrictEqual(`Error sending e-mail to ${emailToInvite}: Error: Test Error`);
  });
});
