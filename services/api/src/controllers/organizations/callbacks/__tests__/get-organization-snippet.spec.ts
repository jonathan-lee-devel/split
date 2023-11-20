import {expect} from '@jest/globals';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {makeGetOrganizationSnippetCallback} from '../get-organization-snippet';

describe('Get Organization Snippet Callback Unit Tests', () => {
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
    const getOrganizationSnippet = makeGetOrganizationSnippetCallback(
        // @ts-ignore
        {},
        {},
        () => {},
    );

    expect(getOrganizationSnippet).toBeDefined();
    expect(getOrganizationSnippet).toBeInstanceOf(Function);
  });
  it('When get organization snippet Then organization snippet returned with correct status', async () => {
    const getOrganizationSnippet = makeGetOrganizationSnippetCallback(
        {
        // @ts-ignore
          info: () => {},
        },
        // @ts-ignore
        {
          findOne: (filter) => {
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
        () => organizationId,
    );

    const result: any = {};
    let returnedCode: number = 0;
    await getOrganizationSnippet(
        // @ts-ignore
        {user: undefined, body: {}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {json: (model) => {
            result.id = model.id;
            result.name = model.name;
            result.administratorEmails = model.administratorEmails;
            result.memberEmails = model.memberEmails;
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(result).toStrictEqual(organization);
  });
  it('When get organization snippet And organization does not exist Then organization snippet returned with correct status', async () => {
    const getOrganizationSnippet = makeGetOrganizationSnippetCallback(
        {
        // @ts-ignore
          info: () => {},
        },
        // @ts-ignore
        {
          findOne: (filter) => {
            return {
              exec: () => {
                return undefined;
              },
            };
          },
        },
        () => organizationId,
    );

    let returnedCode: number = 0;
    await getOrganizationSnippet(
        // @ts-ignore
        {user: undefined, body: {}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {send: () => {
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.NOT_FOUND);
  });
});
