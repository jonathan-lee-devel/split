import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {makeGetOrganizationSnippetFromOrganizationInvitationCallback} from '../get-organization-snippet-from-invitation';

describe('Get Organization Snippet from Invitation Callback Unit Tests', () => {
  const organizationInvitationValue = '54321';
  const organizationId = '12345';
  const organizationName = 'Test';
  const email = 'test@example.com';
  const organizationAdministratorEmails = [email];
  const organizationMemberEmails: string[] = [];
  const organization: any = {
    id: organizationId,
    name: organizationName,
    administratorEmails: organizationAdministratorEmails,
    memberEmails: organizationMemberEmails,
  };

  it('When make get organization snippet callback Then defined function', async () => {
    const getOrganizationSnippetFromInvitation = makeGetOrganizationSnippetFromOrganizationInvitationCallback(
        // @ts-ignore
        {},
        {},
        {},
        () => {},
    );

    expect(getOrganizationSnippetFromInvitation).toBeDefined();
    expect(getOrganizationSnippetFromInvitation).toBeInstanceOf(Function);
  });
  it('When get organization snippet and no invitation Then correct status', async () => {
    let loggedMessage: string | undefined;
    const getOrganizationSnippetFromInvitation = makeGetOrganizationSnippetFromOrganizationInvitationCallback(
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
    );

    let returnedCode: number | undefined;

    // @ts-ignore
    await getOrganizationSnippetFromInvitation({params: {organizationInvitationValue}},
        {
          status(code) {
            returnedCode = code;
            return {
              send: () => {},
            };
          },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.NOT_FOUND);
    expect(loggedMessage).toStrictEqual(`Request to get organization snippet for organization invitation with ID: ${organizationInvitationValue}`);
  });
  it('When get organization snippet and no organization Then correct status', async () => {
    let loggedMessage: string | undefined;
    const getOrganizationSnippetFromInvitation = makeGetOrganizationSnippetFromOrganizationInvitationCallback(
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
                return {};
              },
            };
          },
        },
        {
          findOne: () => {
            return {
              exec: () => undefined,
            };
          },
        },
        () => {},
    );

    let returnedCode: number | undefined;

    // @ts-ignore
    await getOrganizationSnippetFromInvitation({params: {organizationInvitationValue}},
        {
          status(code) {
            returnedCode = code;
            return {
              send: () => {},
            };
          },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.NOT_FOUND);
    expect(loggedMessage).toStrictEqual(`Request to get organization snippet for organization invitation with ID: ${organizationInvitationValue}`);
  });
  it('When get organization snippet and no organization Then correct status', async () => {
    let loggedMessage: string | undefined;
    const getOrganizationSnippetFromInvitation = makeGetOrganizationSnippetFromOrganizationInvitationCallback(
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
                return {};
              },
            };
          },
        },
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  ...organization,
                  toJSON: () => organization,
                };
              },
            };
          },
        },
        () => {},
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await getOrganizationSnippetFromInvitation({params: {organizationInvitationValue}},
        {
          status(code) {
            returnedCode = code;
            return {
              json: (body) => {
                returnedBody = body;
              },
            };
          },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual(organization);
    expect(loggedMessage).toStrictEqual(`Request to get organization snippet for organization invitation with ID: ${organizationInvitationValue}`);
  });
});
