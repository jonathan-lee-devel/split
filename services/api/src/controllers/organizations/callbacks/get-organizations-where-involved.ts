import winston from 'winston';
import {Model} from 'mongoose';
import {Organization} from '../../../models/organizations/Organization';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {
  GetOrganizationsWhereInvolvedRequestBody,
  GetOrganizationsWhereInvolvedRequestQuery,
} from '../schemas/get-organizations-where-involved';
import {OrganizationDto} from '../../../dtos/organizations/OrganizationDto';
import {HttpStatus} from '../../../lib/enums/HttpStatus';

export const makeGetOrganizationsWhereInvolvedCallback = (
    logger: winston.Logger,
    Organization: Model<Organization>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<GetOrganizationsWhereInvolvedRequestBody, GetOrganizationsWhereInvolvedRequestQuery> => async (
    req, res) => {
  const requestingUserEmail = req.user.email;
  logger.info(`Request from <${requestingUserEmail}> to get all organizations where involved`);

  const organizationsWhereInvolved = await Organization.find({
    $or: [
      {administratorEmails: {$all: [requestingUserEmail]}},
      {memberEmails: {$all: [requestingUserEmail]}},
    ],
  }).exec();

  const organizationDtos: OrganizationDto[] = [];
  for (const organization of organizationsWhereInvolved) {
    const organizationData = await organization;
    organizationDtos.push(organizationData.toJSON({transform}));
  }
  return res.status(HttpStatus.OK).json(organizationDtos);
};
