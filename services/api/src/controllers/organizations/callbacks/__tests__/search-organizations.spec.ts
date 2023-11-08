import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {makeSearchOrganizationsCallback} from '../search-organizations';
import {ModelTransformFunction} from '../../../../lib/model-transform/default-model-transform';

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
    const searchOrganizations = makeSearchOrganizationsCallback(
        // @ts-ignore
        {},
        {},
        () => {},
    );

    expect(searchOrganizations).toBeDefined();
    expect(searchOrganizations).toBeInstanceOf(Function);
  });
  it('When get organization snippet Then organization snippet returned with correct status', async () => {
    const searchOrganizations = makeSearchOrganizationsCallback(
        {
        // @ts-ignore
          info: () => {},
        },
        // @ts-ignore
        {
          find: (filter) => {
            return {
              exec: () => [{
                ...organization,
                toJSON: (transform: ModelTransformFunction) => {
                  return organization;
                },
              }],
            };
          },
        },
        () => organizationId,
    );

    const result: any[] = [];
    let returnedCode: number = 0;
    await searchOrganizations(
        // @ts-ignore
        {user: undefined, body: {}, params: {searchString: organizationName}},
        {status(code: number) {
          returnedCode = code;
          return {json: (models: any) => {
            for (const model of models) {
              result.push({
                id: model.id,
                name: model.name,
                administratorEmails: model.administratorEmails,
                memberEmails: model.memberEmails,
              });
            }
          }};
        },
        });

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(result).toStrictEqual([organization]);
  });
});
