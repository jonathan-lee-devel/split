import {GenerateIdFunction} from '@split-common/split-auth';
import {AuthenticatedEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {ModelTransformFunction} from '@split-common/split-service-config';
import {Model} from 'mongoose';
import winston from 'winston';

import {Property} from '../../../models';
import {CreatePropertyRequestBody, CreatePropertyRequestQuery} from '../schemas/create-property';

export const makeCreatePropertyCallback = (
    logger: winston.Logger,
    generateId: GenerateIdFunction,
    Property: Model<Property>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<CreatePropertyRequestBody, CreatePropertyRequestQuery> =>
  wrapTryCatchAuthenticated<CreatePropertyRequestBody, CreatePropertyRequestQuery>(async (req, res) => {
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
  }) as any;
