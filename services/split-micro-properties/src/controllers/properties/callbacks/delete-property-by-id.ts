import {AuthenticatedEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {ModelTransformFunction} from '@split-common/split-service-config';
import {Model} from 'mongoose';
import winston from 'winston';

import {Property} from '../../../models';
import {DeletePropertyByIdRequestBody, DeletePropertyByIdRequestQuery} from '../schemas/delete-property-by-id';

export const makeDeletePropertyByIdCallback = (
    logger: winston.Logger,
    Property: Model<Property>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<DeletePropertyByIdRequestBody, DeletePropertyByIdRequestQuery> =>
  wrapTryCatchAuthenticated<DeletePropertyByIdRequestBody, DeletePropertyByIdRequestQuery>(async (req, res) => {
    const requestingUserEmail = req.user.email;
    const {propertyId} = req.params;
    logger.info(`Request from <${requestingUserEmail}> to delete property with ID: ${propertyId}`);

    const property = await Property.findOne({id: propertyId}).exec();
    if (!property) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    if (!property.administratorEmails.includes(requestingUserEmail)) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }

    await Property.deleteOne({id: propertyId}).exec();

    return res.status(HttpStatus.OK).json(property.toJSON({transform}));
  }) as any;
