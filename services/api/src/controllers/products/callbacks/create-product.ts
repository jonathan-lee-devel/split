import winston from 'winston';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {CreateProductRequestBody, CreateProductRequestQuery} from '../schemas/create-product';
import {GenerateIdFunction} from '../../../lib/generate-id';
import {Model} from 'mongoose';
import {Organization} from '../../../models/organizations/Organization';
import {Product} from '../../../models/products/Product';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';
import Dinero, {Currency} from 'dinero.js';
import {DEFAULT_PRECISION} from '../../../constants/products/dinero-constants';

export const makeCreateProductCallback = (
    logger: winston.Logger,
    Organization: Model<Organization>,
    generateId: GenerateIdFunction,
    Product: Model<Product>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<CreateProductRequestBody, CreateProductRequestQuery> => async (req, res) => {
  const requestingUserEmail = req.user.email;
  const {name, organizationId, priceAmount, priceCurrency} = req.body;
  logger.info(`Request from <${requestingUserEmail}> to create product with name: ${name} for organization with ID: ${organizationId}`);
  // @ts-ignore
  const convertedCurrency: Currency = priceCurrency;
  try {
    Dinero({amount: priceAmount, currency: convertedCurrency, precision: DEFAULT_PRECISION});
  } catch (err) {
    logger.error(err);
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Invalid currency/amount provided for product price`});
  }

  const organization = await Organization.findOne({id: organizationId}).exec();
  if (!organization) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationId} does not exist`});
  }

  if (!organization.administratorEmails.includes(requestingUserEmail)) {
    return res.status(HttpStatus.FORBIDDEN).send();
  }

  const product = await Product.create({id: await generateId(), name, organizationId, priceAmount, priceCurrency});

  return res.status(HttpStatus.CREATED).json(product.toJSON({transform}));
};
