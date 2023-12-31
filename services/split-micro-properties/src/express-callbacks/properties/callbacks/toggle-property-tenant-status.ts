import {AuthenticatedEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {ModelTransformFunction} from '@split-common/split-service-config';
import {Model} from 'mongoose';
import winston from 'winston';

import {Property} from '../../../dao/PropertyDAO';
import {
  TogglePropertyTenantStatusRequestBody,
  TogglePropertyTenantStatusRequestQuery,
} from '../../../schemas/toggle-property-tenant-status';

export const makeTogglePropertyTenantStatusCallback = (
    logger: winston.Logger,
    Property: Model<Property>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<TogglePropertyTenantStatusRequestBody, TogglePropertyTenantStatusRequestQuery> =>
  wrapTryCatchAuthenticated<
    TogglePropertyTenantStatusRequestBody,
    TogglePropertyTenantStatusRequestQuery
  >(async (req, res) => {
    const requestingUserEmail = req.user.email;
    const {emailToToggle} = req.body;
    const {propertyId} = req.params;
    logger.info(`Request from <${requestingUserEmail}> to toggle tenant status for email: <${emailToToggle}> for ID: ${propertyId}`);

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

    if (property.tenantEmails.includes(emailToToggle)) {
      property.tenantEmails.splice(property.tenantEmails.indexOf(emailToToggle), 1);
    } else {
      property.tenantEmails.push(emailToToggle);
    }

    property.markModified('tenantEmails');
    await property.save();

    return res.status(HttpStatus.OK).json(property.toJSON({transform}));
  }) as any;
