import {makeGetProductsCallback} from '../get-products';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {Product} from '../../../../models/products/Product';
import Dinero from 'dinero.js';
import {DEFAULT_PRECISION} from '../../../../constants/products/dinero-constants';

describe('Get Products Callback Unit Tests', () => {
  const organizationId = '12345';
  it('When make get products callback Then defined function', async () => {
    // @ts-ignore
    const getProducts = makeGetProductsCallback({}, {});

    expect(getProducts).toBeDefined();
    expect(getProducts).toBeInstanceOf(Function);
  });
  it('When get products And no products Then return correct status with empty list', async () => {
    let loggedMessage: string | undefined;
    let queryFilter: any;
    const getProducts = makeGetProductsCallback({
      // @ts-ignore
      info: (message) => {
        loggedMessage = message;
      },
    },
    {
      find: (filter) => {
        queryFilter = filter;
        return {
          exec: () => {
            return [];
          },
        };
      },
    });

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await getProducts({params: {organizationId}}, {
      status(code: number) {
        returnedCode = code;
        return {
          json: (body) => {
            returnedBody = body;
          },
        };
      },
    });

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual([]);
    expect(loggedMessage).toStrictEqual(`Request to get products for organization with ID: ${organizationId}`);
    expect(queryFilter).toStrictEqual({organizationId});
  });
  it('When get products Then return correct status', async () => {
    let loggedMessage: string | undefined;
    let queryFilter: any;
    const products: Product[] = [{
      id: '12345',
      organizationId,
      name: 'Test',
      priceAmount: 299,
      priceCurrency: 'EUR',
    }];
    const getProducts = makeGetProductsCallback({
      // @ts-ignore
      info: (message) => {
        loggedMessage = message;
      },
    },
    {
      find: (filter) => {
        queryFilter = filter;
        return {
          exec: () => {
            return products;
          },
        };
      },
    });

    let returnedCode: number | undefined;
    let returnedBody: any;
    // @ts-ignore
    await getProducts({params: {organizationId}}, {
      status(code: number) {
        returnedCode = code;
        return {
          json: (body) => {
            returnedBody = body;
          },
        };
      },
    });

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(returnedBody).toStrictEqual([{
      id: products[0].id,
      name: products[0].name,
      organizationId: products[0].organizationId,
      price: Dinero({amount: products[0].priceAmount, currency: products[0].priceCurrency, precision: DEFAULT_PRECISION}).toFormat(),
      createdAt: undefined,
      updatedAt: undefined,
    }]);
    expect(loggedMessage).toStrictEqual(`Request to get products for organization with ID: ${organizationId}`);
    expect(queryFilter).toStrictEqual({organizationId});
  });
});
