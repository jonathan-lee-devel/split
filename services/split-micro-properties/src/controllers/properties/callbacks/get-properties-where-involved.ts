import {AuthenticatedEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {Model} from 'mongoose';
import winston from 'winston';

import {PropertyDto} from '../../../dtos';
import {Property} from '../../../models';
import {GetPropertiesWhereInvolvedRequestBody, GetPropertiesWhereInvolvedRequestQuery} from '../schemas/get-properties-where-involved';

export const makeGetPropertiesWhereInvolvedCallback = (
    logger: winston.Logger,
    Property: Model<Property>,
): AuthenticatedEndpointCallback<GetPropertiesWhereInvolvedRequestBody, GetPropertiesWhereInvolvedRequestQuery> =>
  wrapTryCatchAuthenticated<GetPropertiesWhereInvolvedRequestBody, GetPropertiesWhereInvolvedRequestQuery>(async (req, res) => {
    const requestingUserEmail = req.user.email;
    logger.info(`Request from <${requestingUserEmail}> to get properties where involved.`);

    const propertiesWhereInvolved = await Property.find({
      $or: [
        {administratorEmails: requestingUserEmail},
        {tenantEmails: requestingUserEmail},
      ],
    }).exec();

    const transformedProperties: PropertyDto[] = [];
    for (const property of propertiesWhereInvolved) {
      transformedProperties.push({
        id: (await property).id,
        name: (await property).name,
        administratorEmails: (await property).administratorEmails,
        tenantEmails: (await property).tenantEmails,
        createdByEmail: (await property).createdByEmail,
        // Using mongoose timestamps
        // @ts-ignore
        createdAt: (await property).createdAt,
        // @ts-ignore
        updatedAt: (await property).updatedAt,
      });
    }

    return res.status(HttpStatus.OK).json(transformedProperties);
  }) as any;
