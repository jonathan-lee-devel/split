import {makeCreateOrganizationCallback} from '../create-organization';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';

describe('Create Organization Callback Unit Tests', () => {
  const organizationId = '12345';
  const organizationName = 'Test';
  const email = 'test@example.com';
  const organizationAdministratorEmails = [email];
  const organizationMemberEmails: string[] = [];

  it('When make create organization callback Then defined function', async () => {
    const createOrganization = makeCreateOrganizationCallback(
        // @ts-ignore
        {},
        {},
        () => {},
        () => {},
    );

    expect(createOrganization).toBeDefined();
    expect(createOrganization).toBeInstanceOf(Function);
  });
  it('When create organization Then organization created with correct status', async () => {
    let passedId = undefined;
    let passedName = undefined;
    let passedAdministratorEmails = undefined;
    let passedMemberEmails = undefined;
    const createOrganization = makeCreateOrganizationCallback(
        {
          // @ts-ignore
          info: () => {},
        },
        // @ts-ignore
        {
          create: (organization: any) => {
            passedId = organizationId;
            passedName = organization.name;
            passedAdministratorEmails = organization.administratorEmails;
            passedMemberEmails = organization.memberEmails;
            const createdOrganization = {
              id: organizationId,
              name: organization.name,
              administratorEmails: organization.administratorEmails,
              memberEmails: organization.memberEmails,
            };
            return {
              toJSON: () => createdOrganization,
              ...createdOrganization,
            };
          },
        },
        () => organizationId,
        () => {},
    );

    const result: any = {};
    let returnedCode: number = 0;
    await createOrganization(
        // @ts-ignore
        {user: {email}, body: {name: organizationName}},
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

    expect(returnedCode).toStrictEqual(HttpStatus.CREATED);
    expect(passedId).toStrictEqual(organizationId);
    expect(passedName).toStrictEqual(organizationName);
    expect(passedAdministratorEmails).toStrictEqual(organizationAdministratorEmails);
    expect(passedMemberEmails).toStrictEqual(organizationMemberEmails);

    expect(result.id).toStrictEqual(organizationId);
    expect(result.name).toStrictEqual(organizationName);
    expect(result.administratorEmails).toStrictEqual(organizationAdministratorEmails);
    expect(result.memberEmails).toStrictEqual(organizationMemberEmails);
  });
});
