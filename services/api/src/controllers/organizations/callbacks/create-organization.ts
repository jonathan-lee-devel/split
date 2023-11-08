import winston from 'winston';
import {Model} from 'mongoose';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {CreateOrganizationRequestBody, CreateOrganizationRequestQuery} from '../schemas/create-organization';
import {GenerateIdFunction} from '../../../lib/generate-id';
import {Organization} from '../../../models/organizations/Organization';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';

export const makeCreateOrganizationCallback = (
    logger: winston.Logger,
    Organization: Model<Organization>,
    generateId: GenerateIdFunction,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<CreateOrganizationRequestBody, CreateOrganizationRequestQuery> => async (req, res) => {
  const requestingUserEmail = req.user.email;
  const {name} = req.body;
  logger.info(`Request to from <${requestingUserEmail}> create organization with name: ${name}`);

  const organization = await Organization.create({
    id: await generateId(),
    name,
    administratorEmails: [requestingUserEmail],
    memberEmails: [],
  });

  logger.info(`User <${requestingUserEmail}> created organization with ID: ${organization.id}`);

  return res.status(HttpStatus.CREATED).json(organization.toJSON({transform}));
};
