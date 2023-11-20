import {expect} from '@jest/globals';
import {makeRemoveOrganizationAdministratorCallback} from '../remove-organization-administrator';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {ADMINISTRATOR_EMAILS_FIELD} from '../../../../constants/organizations/field-names';

describe('Remove Organization Administrator Callback Unit Tests', () => {
  const organizationId = '12345';
  const organizationName = 'Test';
  const email = 'test@example.com';
  const anotherEmail = 'another@example.com';
  const yetAnotherEmail = 'yet-another@example.com';
  const organizationMemberEmails: string[] = [];

  it('When make remove organization administrator callback Then defined function', async () => {
    const removeOrganizationAdministrator = makeRemoveOrganizationAdministratorCallback(
        // @ts-ignore
        {},
        {},
        () => {},
    );

    expect(removeOrganizationAdministrator).toBeDefined();
    expect(removeOrganizationAdministrator).toBeInstanceOf(Function);
  });
  it('When remove organization administrator Then remove organization administrator with correct status', async () => {
    const organizationAdministratorEmails = [email, anotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    let fieldModified = '';
    let isSaveCalled = false;
    const removeOrganizationAdministrator = makeRemoveOrganizationAdministratorCallback(
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
    await removeOrganizationAdministrator(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {administratorEmailToRemove: anotherEmail}, params: {organizationId}},
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
    expect(fieldModified).toStrictEqual(ADMINISTRATOR_EMAILS_FIELD);
    expect(isSaveCalled).toBeTruthy();
  });
  it('When remove organization administrator on non-existent organization Then organization administrator not removed with correct status', async () => {
    const removeOrganizationAdministrator = makeRemoveOrganizationAdministratorCallback(
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
    await removeOrganizationAdministrator(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {administratorEmailToRemove: anotherEmail}, params: {organizationId}},
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
  it('When remove organization administrator And not administrator Then organization administrator not removed with correct status', async () => {
    const organizationAdministratorEmails = [anotherEmail, yetAnotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    let isSaveCalled = false;
    const removeOrganizationAdministrator = makeRemoveOrganizationAdministratorCallback(
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
    await removeOrganizationAdministrator(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {administratorEmailToRemove: anotherEmail}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {send: () => {
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.FORBIDDEN);
    expect(isSaveCalled).toBeFalsy();
  });
  it('When remove organization administrator And administrator non-existent Then organization administrator not removed with correct status', async () => {
    const organizationAdministratorEmails = [email, yetAnotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    const removeOrganizationAdministrator = makeRemoveOrganizationAdministratorCallback(
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
    await removeOrganizationAdministrator(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {administratorEmailToRemove: anotherEmail}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {json: (error: any) => {
            returnedError = error;
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedError.error).toStrictEqual(`Organization with ID: ${organizationId} does not have administrator: ${anotherEmail}`);
  });
  it('When remove organization administrator And only 1 or less administrators Then organization administrator not removed with correct status', async () => {
    const organizationAdministratorEmails = [email];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    const removeOrganizationAdministrator = makeRemoveOrganizationAdministratorCallback(
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
    await removeOrganizationAdministrator(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {administratorEmailToRemove: email}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {json: (error: any) => {
            returnedError = error;
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedError.error).toStrictEqual(`Organization with ID: ${organizationId} requires at least one administrator`);
  });
});
