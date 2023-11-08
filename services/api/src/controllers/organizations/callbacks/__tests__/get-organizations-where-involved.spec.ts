import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {makeGetOrganizationsWhereInvolvedCallback} from '../get-organizations-where-involved';
import {Organization} from '../../../../models/organizations/Organization';

describe('Get Organizations Where Involved Callback Unit Tests', () => {
  const organizationId = '12345';
  const organizationName = 'Test';
  const email = 'test@example.com';
  const organizationAdministratorEmails = [email];
  const organizationMemberEmails: string[] = [];
  const organization: Organization = {
    id: organizationId,
    name: organizationName,
    administratorEmails: organizationAdministratorEmails,
    memberEmails: organizationMemberEmails,
  };

  it('When make create organization callback Then defined function', async () => {
    const getOrganizationsWhereInvolved = makeGetOrganizationsWhereInvolvedCallback(
        // @ts-ignore
        {},
        {},
        () => {},
    );

    expect(getOrganizationsWhereInvolved).toBeDefined();
    expect(getOrganizationsWhereInvolved).toBeInstanceOf(Function);
  });
  it('When get organizations where involved Then organizations returned with correct status', async () => {
    const getOrganizationsWhereInvolved = makeGetOrganizationsWhereInvolvedCallback(
        {
          // @ts-ignore
          info: () => {},
        },
        // @ts-ignore
        {
          find: () => {
            return {
              exec: () => [{
                ...organization,
                toJSON: () => {
                  return {
                    ...organization,
                  };
                },
              }],
            };
          },
        },
        () => organizationId,
    );

    const result: any = {};
    let returnedCode: number = 0;
    await getOrganizationsWhereInvolved(
        // @ts-ignore
        {user: {email}},
        {status(code: number) {
          returnedCode = code;
          return {json: (model: any[]) => {
            result.id = model[0].id;
            result.name = model[0].name;
            result.administratorEmails = model[0].administratorEmails;
            result.memberEmails = model[0].memberEmails;
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(result.id).toStrictEqual(organizationId);
    expect(result.name).toStrictEqual(organizationName);
    expect(result.administratorEmails).toStrictEqual(organizationAdministratorEmails);
    expect(result.memberEmails).toStrictEqual(organizationMemberEmails);
  });
});
