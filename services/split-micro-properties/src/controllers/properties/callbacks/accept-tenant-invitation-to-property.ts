import {AnonymousEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {ModelTransformFunction} from '@split-common/split-service-config';
import {isAfter} from 'date-fns/isAfter';
import {Model} from 'mongoose';
import winston from 'winston';

import {Property} from '../../../models';
import {PropertyInvitationVerificationToken} from '../../../models/property/PropertyInvitationVerificationToken';
import {
  AcceptTenantInvitationToPropertyRequestBody,
  AcceptTenantInvitationToPropertyRequestQuery,
} from '../schemas/accept-tenant-invitation-to-property';

export const makeAcceptTenantInvitationToPropertyCallback = (
    logger: winston.Logger,
    Property: Model<Property>,
    PropertyInvitationVerificationToken: Model<PropertyInvitationVerificationToken>,
    transform: ModelTransformFunction,
): AnonymousEndpointCallback<AcceptTenantInvitationToPropertyRequestBody, AcceptTenantInvitationToPropertyRequestQuery> =>
  wrapTryCatchAuthenticated<
    AcceptTenantInvitationToPropertyRequestBody,
    AcceptTenantInvitationToPropertyRequestQuery
  >(async (req, res) => {
    const {tokenValue} = req.body;
    const {propertyId} = req.params;
    logger.info(`Request to accept tenant property invitation for token value: ${tokenValue} at property ID: ${propertyId}`);

    const token = await PropertyInvitationVerificationToken.findOne({value: tokenValue}).exec();
    if (!token) {
      return res.status(HttpStatus.BAD_REQUEST).json({error: `No token found for that value`});
    }

    if (isAfter(new Date(), token.expiryDate)) {
      return res.status(HttpStatus.BAD_REQUEST).json({error: `This token is expired, you will need to be re-invited`});
    }

    if (token.isAccepted) {
      return res.status(HttpStatus.BAD_REQUEST).json({error: `This invitation has already been accepted`});
    }

    const property = await Property.findOne({id: token.propertyId}).exec();
    if (!property || propertyId !== property.id) {
      return res.status(HttpStatus.BAD_REQUEST).json({error: `No property found for that token value or property does not match path`});
    }

    const acceptedEmails = new Set<string>(property.acceptedInvitationEmails);
    acceptedEmails.add(token.userEmail);
    property.acceptedInvitationEmails = Array.from(acceptedEmails.values());
    property.markModified('acceptedInvitationEmails');
    await property.save();
    token.isAccepted = true;
    token.expiryDate = new Date();
    await token.save();

    return res.status(HttpStatus.OK).json(property.toJSON({transform}));
  }) as any;
