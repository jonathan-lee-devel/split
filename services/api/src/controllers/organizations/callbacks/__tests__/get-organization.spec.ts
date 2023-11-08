import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {makeGetOrganizationCallback} from '../get-organization';

describe('Get Organization Callback Unit Tests', () => {
  const organizationId = '12345';
  const organizationName = 'Test';
  const email = 'test@example.com';
  const anotherEmail = 'another@example.com';
  const organizationAdministratorEmails = [email];
  const organizationMemberEmails: string[] = [];
  const organization: any = {
    id: organizationId,
    name: organizationName,
    administratorEmails: organizationAdministratorEmails,
    memberEmails: organizationMemberEmails,
  };

  it('When make get organization callback Then defined function', async () => {
    const getOrganization = makeGetOrganizationCallback(
        // @ts-ignore
        {},
        {},
        () => {},
    );

    expect(getOrganization).toBeDefined();
    expect(getOrganization).toBeInstanceOf(Function);
  });
  it('When get organization Then organization returned with correct status', async () => {
    const getOrganization = makeGetOrganizationCallback(
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
    await getOrganization(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {}, params: {organizationId}},
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
  it('When get organization And organization does not exist Then organization snippet returned with correct status', async () => {
    const getOrganization = makeGetOrganizationCallback(
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
    await getOrganization(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {send: () => {
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.NOT_FOUND);
  });
  it('When get organization Then organization returned with correct status', async () => {
    const getOrganization = makeGetOrganizationCallback(
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

    let returnedCode: number = 0;
    await getOrganization(
        // @ts-ignore
        {user: {email: anotherEmail, emailVerified: true}, body: {}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {send: () => {
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.FORBIDDEN);
  });
});
