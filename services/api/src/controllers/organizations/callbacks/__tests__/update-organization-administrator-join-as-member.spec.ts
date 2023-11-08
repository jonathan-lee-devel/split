import {makeUpdateOrganizationAdministratorJoinAsMemberCallback} from '../update-organization-administrator-join-as-member';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {MEMBER_EMAILS_FIELD} from '../../../../constants/organizations/field-names';

describe('Update Organization Administrator Join As Member Callback Unit Tests', () => {
  const organizationId = '12345';
  const organizationName = 'Test';
  const email = 'test@example.com';
  const anotherEmail = 'another@example.com';
  const yetAnotherEmail = 'yet-another@example.com';

  it('When make update organization administrator callback Then defined function', async () => {
    const updateOrganizationAdministratorJoinAsMember = makeUpdateOrganizationAdministratorJoinAsMemberCallback(
        // @ts-ignore
        {},
        {},
        () => {},
    );

    expect(updateOrganizationAdministratorJoinAsMember).toBeDefined();
    expect(updateOrganizationAdministratorJoinAsMember).toBeInstanceOf(Function);
  });
  it('When update organization administrator Then update organization administrator with correct status', async () => {
    const organizationAdministratorEmails = [email, anotherEmail];
    const organizationMemberEmails: string[] = [];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    let fieldModified = '';
    let isSaveCalled = false;
    const updateOrganizationAdministratorJoinAsMember = makeUpdateOrganizationAdministratorJoinAsMemberCallback(
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
    await updateOrganizationAdministratorJoinAsMember(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {administratorEmailToUpdate: anotherEmail}, params: {organizationId}},
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
  it('When update organization administrator on non-existent organization Then organization member not removed with correct status', async () => {
    const updateOrganizationAdministratorJoinAsMember = makeUpdateOrganizationAdministratorJoinAsMemberCallback(
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
    await updateOrganizationAdministratorJoinAsMember(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {administratorEmailToUpdate: anotherEmail}, params: {organizationId}},
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
  it('When update organization administrator And not administrator Then organization member not removed with correct status', async () => {
    const organizationAdministratorEmails = [anotherEmail, yetAnotherEmail];
    const organizationMemberEmails = [anotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    let isSaveCalled = false;
    const updateOrganizationAdministratorJoinAsMember = makeUpdateOrganizationAdministratorJoinAsMemberCallback(
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
    await updateOrganizationAdministratorJoinAsMember(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {administratorEmailToUpdate: yetAnotherEmail}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {send: () => {
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.FORBIDDEN);
    expect(isSaveCalled).toBeFalsy();
  });
  it('When update organization administrator And member non-existent Then organization member not removed with correct status', async () => {
    const organizationAdministratorEmails = [email, yetAnotherEmail];
    const organizationMemberEmails = [yetAnotherEmail];
    const organization: any = {
      id: organizationId,
      name: organizationName,
      administratorEmails: organizationAdministratorEmails,
      memberEmails: organizationMemberEmails,
    };
    const updateOrganizationAdministratorJoinAsMember = makeUpdateOrganizationAdministratorJoinAsMemberCallback(
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
    await updateOrganizationAdministratorJoinAsMember(
        // @ts-ignore
        {user: {email, emailVerified: true}, body: {administratorEmailToUpdate: yetAnotherEmail}, params: {organizationId}},
        {status(code: number) {
          returnedCode = code;
          return {json: (error: any) => {
            returnedError = error;
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedError.error).toStrictEqual( `User: ${yetAnotherEmail} is already a member of organization with ID: ${organizationId}`);
  });
});
