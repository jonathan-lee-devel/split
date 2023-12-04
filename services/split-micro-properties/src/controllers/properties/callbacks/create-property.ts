import winston from 'winston';
import {AuthenticatedEndpointCallback, HttpStatus} from '@split-common/split-http';
import {CreatePropertyRequestBody, CreatePropertyRequestQuery} from '../schemas/create-property';
import {Model} from 'mongoose';
import {Property} from '../../../models';
import {GenerateIdFunction} from '@split-common/split-auth';
import {ModelTransformFunction} from '@split-common/split-service-config';

export const makeCreatePropertyCallback = (
    logger: winston.Logger,
    generateId: GenerateIdFunction,
    Property: Model<Property>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<CreatePropertyRequestBody, CreatePropertyRequestQuery> => async (req, res) => {
  const requestingUserEmail = req.user.email;
  const {name, tenantEmails} = req.body;
  logger.info(`Request from <${requestingUserEmail}> to create property with name ${name}`);

  const property = await Property.create({
    id: await generateId(),
    createdByEmail: requestingUserEmail,
    name,
    administratorEmails: [requestingUserEmail],
    tenantEmails,
  });

  return res.status(HttpStatus.CREATED).json(property.toJSON({transform}));
};
