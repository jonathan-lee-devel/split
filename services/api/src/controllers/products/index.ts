import {makeMakeCreateProductEndpoint} from './endpoints/create-product';
import {returnAnonymouslyBasedOnSafeParseResult, returnBasedOnAuthenticationAndSafeParseResult} from '../../lib/endpoint-util';
import {CreateProductRequestBodySchema, CreateProductRequestQuerySchema} from './schemas/create-product';
import {makeCreateProductCallback} from './callbacks/create-product';
import {OrganizationModel} from '../../models/organizations/Organization';
import {generateId} from '../../lib/generate-id';
import logger from '../../logger';
import {ProductModel} from '../../models/products/Product';
import {defaultModelTransform} from '../../lib/model-transform/default-model-transform';
import {makeMakeGetProductsEndpoint} from './endpoints/get-products';
import {GetProductsRequestBodySchema, GetProductsRequestQuerySchema} from './schemas/get-products';
import {makeGetProductsCallback} from './callbacks/get-products';

export const getProductsHandler = makeMakeGetProductsEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    GetProductsRequestBodySchema,
    GetProductsRequestQuerySchema,
    makeGetProductsCallback(
        logger,
        ProductModel,
    ),
);

export const createProductHandler = makeMakeCreateProductEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    CreateProductRequestBodySchema,
    CreateProductRequestQuerySchema,
    makeCreateProductCallback(
        logger,
        OrganizationModel,
        generateId,
        ProductModel,
        defaultModelTransform,
    ),
);
