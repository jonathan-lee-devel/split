import {AuthenticatedEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {ModelTransformFunction} from '@split-common/split-service-config';
import {Model} from 'mongoose';
import winston from 'winston';

import {Property} from '../../../entities/PropertyEntity';
import {
  TogglePropertyAdministratorStatusRequestBody,
  TogglePropertyAdministratorStatusRequestQuery,
} from '../../../schemas/toggle-property-administrator-status';

export const makeTogglePropertyAdministratorStatusCallback = (
    logger: winston.Logger,
    Property: Model<Property>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<TogglePropertyAdministratorStatusRequestBody, TogglePropertyAdministratorStatusRequestQuery> =>
  wrapTryCatchAuthenticated<
    TogglePropertyAdministratorStatusRequestBody,
    TogglePropertyAdministratorStatusRequestQuery
  >(async (req, res) => {
    const requestingUserEmail = req.user.email;
    const {emailToToggle} = req.body;
    const {propertyId} = req.params;
    logger.info(`Request from <${requestingUserEmail}> to toggle administrator status for email: <${emailToToggle}> for ID: ${propertyId}`);

    const property = await Property.findOne({id: propertyId}).exec();
    if (!property) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    if (!property.administratorEmails.includes(requestingUserEmail)) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }

    if (!property.administratorEmails.includes(emailToToggle) &&
    !property.tenantEmails.includes(emailToToggle)) {
      return res.status(HttpStatus.BAD_REQUEST).json({error: `E-mail: ${emailToToggle} is not an administrator or tenant`});
    }

    if (property.administratorEmails.includes(emailToToggle)) {
      if (property.administratorEmails.length === 1) {
        return res.status(HttpStatus.BAD_REQUEST).json({error: `Property: ${property.name} requires at least one administrator`});
      }
      property.administratorEmails = property.administratorEmails.filter((administratorEmail) => administratorEmail !== emailToToggle);
    } else {
      property.administratorEmails.push(emailToToggle);
    }

    property.markModified('administratorEmails');
    await property.save();

    return res.status(HttpStatus.OK).json(property.toJSON({transform}));
  }) as any;
