import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {ADMINISTRATOR_EMAILS_FIELD} from '../../../../constants/organizations/field-names';
import {makeUpdateOrganizationMemberJoinAsAdministratorCallback} from '../update-organization-member-join-as-administrator';

describe('Update Organization Member Join As Administrator Callback Unit Tests', () => {
  const organizationId = '12345';
  const organizationName = 'Test';
  const email = 'test@example.com';
  const anotherEmail = 'another@example.com';
  const yetAnotherEmail = 'yet-another@example.com';

  it('When make update organization member callback Then defined function', async () => {
    const updateOrganizationMemberJoinAsAdministrator = makeUpdateOrganizationMemberJoinAsAdministratorCallback(
        // @ts-ignore
        {},
        {},
        () => {},
    );

    expect(updateOrganizationMemberJoinAsAdministrator).toBeDefined();
    expect(updateOrganizationMemberJoinAsAdministrator).toBeInstanceOf(Function);
  });
  it('When update organization member Then update organization administrator with correct status', async () => {
    const organizationAdministratorEmails = [email];
    const organizationMemberEmails: string[] = [anotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    let fieldModified = '';
    let isSaveCalled = false;
    const updateOrganizationMemberJoinAsAdministrator = makeUpdateOrganizationMemberJoinAsAdministratorCallback(
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
                  markModified: (field: string) => {
                    fieldModified = field;
                  },
                  save: () => {
                    isSaveCalled = true;
                  },
                };
              },
            };
          },
        },
        () => organizationId,
    );

    const result: any = {};
    let returnedCode: number = 0;
    await updateOrganizationMemberJoinAsAdministrator(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {memberEmailToUpdate: anotherEmail}, params: {organizationId}},
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
    expect(fieldModified).toStrictEqual(ADMINISTRATOR_EMAILS_FIELD);
    expect(isSaveCalled).toBeTruthy();
  });
  it('When update organization member on non-existent organization Then organization member not escalated with correct status', async () => {
    const updateOrganizationMemberJoinAsAdministrator = makeUpdateOrganizationMemberJoinAsAdministratorCallback(
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
    let returnedError: any = {};
    await updateOrganizationMemberJoinAsAdministrator(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {memberEmailToUpdate: anotherEmail}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {json: (error) => {
            returnedError = error;
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedError.error).toStrictEqual(`Organization with ID: ${organizationId} does not exist`);
  });
  it('When update organization member And not administrator Then organization member not escalated with correct status', async () => {
    const organizationAdministratorEmails = [anotherEmail];
    const organizationMemberEmails = [anotherEmail, yetAnotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    let isSaveCalled = false;
    const updateOrganizationMemberJoinAsAdministrator = makeUpdateOrganizationMemberJoinAsAdministratorCallback(
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
                  markModified: () => {
                  },
                  save: () => {
                    isSaveCalled = true;
                  },
                };
              },
            };
          },
        },
        () => organizationId,
    );

    let returnedCode: number = 0;
    await updateOrganizationMemberJoinAsAdministrator(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {memberEmailToUpdate: yetAnotherEmail}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {send: () => {
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.FORBIDDEN);
    expect(isSaveCalled).toBeFalsy();
  });
  it('When update organization member And member already administrator Then organization member not escalated with correct status', async () => {
    const organizationAdministratorEmails = [email, anotherEmail];
    const organizationMemberEmails = [yetAnotherEmail, anotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    const updateOrganizationMemberJoinAsAdministrator = makeUpdateOrganizationMemberJoinAsAdministratorCallback(
        {
        // @ts-ignore
          info: () => {},
        },
        // @ts-ignore
        {
          findOne: (filter) => {
            return {
              exec: () => {
                return organization;
              },
            };
          },
        },
        () => organizationId,
    );

    let returnedCode: number = 0;
    let returnedError: any = {};
    await updateOrganizationMemberJoinAsAdministrator(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {memberEmailToUpdate: anotherEmail}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {json: (error: any) => {
            returnedError = error;
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedError.error).toStrictEqual( `User: ${anotherEmail} is already an administrator of organization with ID: ${organizationId}`);
  });
});
