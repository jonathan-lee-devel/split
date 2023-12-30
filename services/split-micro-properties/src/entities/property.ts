import {GenerateIdFunction} from '@split-common/split-auth';

import {PropertyDAO} from '../dao';

export const makePropertyEntity = (
    propertyDAO: PropertyDAO,
    generateId: GenerateIdFunction,
) => {
  return {
    createNewProperty: async (requestingUserEmail: string, name: string, tenantEmails: string[]) => {
      return await propertyDAO.createAndReturnTransformed({
        id: await generateId(),
        createdByEmail: requestingUserEmail,
        name,
        administratorEmails: [requestingUserEmail],
        tenantEmails,
        acceptedInvitationEmails: [requestingUserEmail],
      });
    },
  };
};
