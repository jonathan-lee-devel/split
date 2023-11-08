import winston from 'winston';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {GetProductsRequestBody, GetProductsRequestQuery} from '../schemas/get-products';
import {Model} from 'mongoose';
import {Product} from '../../../models/products/Product';
import {ProductDto} from '../../../dtos/products/ProductDto';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import Dinero from 'dinero.js';

export const makeGetProductsCallback = (
    logger: winston.Logger,
    Product: Model<Product>,
): AnonymousEndpointCallback<GetProductsRequestBody, GetProductsRequestQuery> => async (req, res) => {
  const {organizationId} = req.params;
  logger.info(`Request to get products for organization with ID: ${organizationId}`);

  const products = await Product.find({organizationId}).exec();

  const productDtos: ProductDto[] = [];
  for (const product of products) {
    productDtos.push({
      id: product.id,
      name: product.name,
      organizationId,
      price: Dinero({amount: product.priceAmount, currency: product.priceCurrency}).toFormat(),
      // Using mongoose with timestamps enabled
      // @ts-ignore
      createdAt: product.createdAt,
      // @ts-ignore
      updatedAt: product.updatedAt});
  }

  return res.status(HttpStatus.OK).json(productDtos);
};
