import {makeRemoveOrganizationMemberCallback} from '../remove-organization-member';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {MEMBER_EMAILS_FIELD} from '../../../../constants/organizations/field-names';

describe('Remove Organization Member Callback Unit Tests', () => {
  const organizationId = '12345';
  const organizationName = 'Test';
  const email = 'test@example.com';
  const anotherEmail = 'another@example.com';
  const yetAnotherEmail = 'yet-another@example.com';

  it('When make remove organization member callback Then defined function', async () => {
    const removeOrganizationMember = makeRemoveOrganizationMemberCallback(
        // @ts-ignore
        {},
        {},
        () => {},
    );

    expect(removeOrganizationMember).toBeDefined();
    expect(removeOrganizationMember).toBeInstanceOf(Function);
  });
  it('When remove organization member Then remove organization member with correct status', async () => {
    const organizationAdministratorEmails = [email, anotherEmail];
    const organizationMemberEmails = [anotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    let fieldModified = '';
    let isSaveCalled = false;
    const removeOrganizationMember = makeRemoveOrganizationMemberCallback(
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
    await removeOrganizationMember(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {memberEmailToRemove: anotherEmail}, params: {organizationId}},
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
    expect(fieldModified).toStrictEqual(MEMBER_EMAILS_FIELD);
    expect(isSaveCalled).toBeTruthy();
  });
  it('When remove organization member on non-existent organization Then organization member not removed with correct status', async () => {
    const removeOrganizationMember = makeRemoveOrganizationMemberCallback(
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
    await removeOrganizationMember(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {memberEmailToRemove: anotherEmail}, params: {organizationId}},
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
  it('When remove organization member And not administrator Then organization member not removed with correct status', async () => {
    const organizationAdministratorEmails = [anotherEmail, yetAnotherEmail];
    const organizationMemberEmails = [anotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    let isSaveCalled = false;
    const removeOrganizationMember = makeRemoveOrganizationMemberCallback(
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
    await removeOrganizationMember(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {memberEmailToRemove: anotherEmail}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {send: () => {
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.FORBIDDEN);
    expect(isSaveCalled).toBeFalsy();
  });
  it('When remove organization member And member non-existent Then organization member not removed with correct status', async () => {
    const organizationAdministratorEmails = [email, yetAnotherEmail];
    const organizationMemberEmails = [yetAnotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    const removeOrganizationMember = makeRemoveOrganizationMemberCallback(
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
    await removeOrganizationMember(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {memberEmailToRemove: anotherEmail}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {json: (error: any) => {
            returnedError = error;
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedError.error).toStrictEqual(`Organization with ID: ${organizationId} does not have member: ${anotherEmail}`);
  });
});
