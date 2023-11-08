import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {makeDeleteOrganizationCallback} from '../delete-organization';

describe('Delete Organization Callback Unit Tests', () => {
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

  it('When make delete organization callback Then defined function', async () => {
    const deleteOrganization = makeDeleteOrganizationCallback(
        // @ts-ignore
        {},
        {},
        () => {},
    );

    expect(deleteOrganization).toBeDefined();
    expect(deleteOrganization).toBeInstanceOf(Function);
  });
  it('When delete organization Then organization deleted with correct status', async () => {
    const deleteOrganization = makeDeleteOrganizationCallback(
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
          deleteOne: (filter) => {
            return {
              exec: () => {},
            };
          },
        },
        () => organizationId,
    );

    const result: any = {};
    let returnedCode: number = 0;
    await deleteOrganization(
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
  it('When delete organization on non-existent organization Then organization not deleted with correct status', async () => {
    const deleteOrganization = makeDeleteOrganizationCallback(
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
    await deleteOrganization(
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
  it('When delete organization And user not administrator Then organization not deleted with correct status', async () => {
    let isDeleteCalled = false;
    const deleteOrganization = makeDeleteOrganizationCallback(
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
          deleteOne: (filter) => {
            return {
              exec: () => {
                isDeleteCalled = true;
              },
            };
          },
        },
        () => organizationId,
    );

    let returnedCode: number = 0;
    await deleteOrganization(
        // @ts-ignore
        {user: {email: anotherEmail, emailVerified: true}, body: {}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {send: () => {
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.FORBIDDEN);
    expect(isDeleteCalled).toBeFalsy();
  });
});
