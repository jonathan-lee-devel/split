import {AuthenticatedEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {ModelTransformFunction} from '@split-common/split-service-config';
import {Model} from 'mongoose';
import winston from 'winston';

import {Property} from '../../../models';
import {GetPropertiesWhereInvolvedRequestBody, GetPropertiesWhereInvolvedRequestQuery} from '../schemas/get-properties-where-involved';

export const makeGetPropertiesWhereInvolvedCallback = (
    logger: winston.Logger,
    Property: Model<Property>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<GetPropertiesWhereInvolvedRequestBody, GetPropertiesWhereInvolvedRequestQuery> =>
  wrapTryCatchAuthenticated<GetPropertiesWhereInvolvedRequestBody, GetPropertiesWhereInvolvedRequestQuery>(async (req, res) => {
    const requestingUserEmail = req.user.email;
    logger.info(`Request from <${requestingUserEmail}> to get properties where involved`);

    return res.status(HttpStatus.OK).json((await Property.find({$or: [
      {administratorEmails: requestingUserEmail},
      {tenantEmails: requestingUserEmail},
    ]}).exec())
        .map((property) => property.toJSON({transform})),
    );
  }) as any;
