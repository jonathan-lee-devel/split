import {AuthenticatedEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {ModelTransformFunction} from '@split-common/split-service-config';
import {Model} from 'mongoose';
import winston from 'winston';

import {Property} from '../../../models';
import {GetPropertiesByIdRequestBody, GetPropertyByIdRequestQuery} from '../schemas/get-property-by-id';

export const makeGetPropertyByIdCallback = (
    logger: winston.Logger,
    Property: Model<Property>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<GetPropertiesByIdRequestBody, GetPropertyByIdRequestQuery> =>
  wrapTryCatchAuthenticated<GetPropertiesByIdRequestBody, GetPropertyByIdRequestQuery>(async (req, res) => {
    const requestingUserEmail = req.user.email;
    const {propertyId} = req.params;
    logger.info(`Request from <${requestingUserEmail}> to get property with ID: ${propertyId}`);

    const property = await Property.findOne({id: propertyId}).exec();
    if (!property) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    if (!property.administratorEmails.includes(requestingUserEmail) &&
    !property.tenantEmails.includes(requestingUserEmail)) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }

    return res.status(HttpStatus.OK).json(property.toJSON({transform}));
  }) as any;
