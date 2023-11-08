import {makeCreateProductCallback} from '../create-product';
import {HttpStatus} from '../../../../lib/enums/HttpStatus';
import {Product} from '../../../../models/products/Product';

describe('Create Product Callback Unit Tests', () => {
  const email = 'test@example.com';
  const organizationId = '12345';
  const name = 'Test';
  const priceAmount = 299;
  const priceCurrency = 'EUR';
  it('When make create product Then defined function', async () => {
    const createProduct = makeCreateProductCallback(
        // @ts-ignore
        {},
        {},
        () => {},
        {},
        () => {},
    );

    expect(createProduct).toBeDefined();
    expect(createProduct).toBeInstanceOf(Function);
  });
  it('When create product And organization not found Then correct status', async () => {
    let loggedMessage: string | undefined;
    const createProduct = makeCreateProductCallback(
        // @ts-ignore
        {info: (message) => {
          loggedMessage = message;
        }},
        {
          findOne: () => {
            return {
              exec: () => undefined,
            };
          },
        },
        () => {},
        {},
        () => {},
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    await createProduct(
        // @ts-ignore
        {user: {email, emailVerified: true}, params: {organizationId}, body: {name, organizationId, priceAmount, priceCurrency}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedCode).toStrictEqual(HttpStatus.BAD_REQUEST);
    expect(returnedBody).toStrictEqual({error: `Organization with ID: ${organizationId} does not exist`});
    expect(loggedMessage).toStrictEqual(`Request from <${email}> to create product with name: ${name} for organization with ID: ${organizationId}`);
  });
  it('When create product And requesting user not administrator Then correct status', async () => {
    let loggedMessage: string | undefined;
    const createProduct = makeCreateProductCallback(
        // @ts-ignore
        {info: (message) => {
          loggedMessage = message;
        }},
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  administratorEmails: ['another@example.com'],
                };
              },
            };
          },
        },
        () => {},
        {},
        () => {},
    );

    let returnedCode: number | undefined;
    await createProduct(
        // @ts-ignore
        {user: {email, emailVerified: true}, params: {organizationId}, body: {name, organizationId, priceAmount, priceCurrency}},
        {status: (code) => {
          returnedCode = code;
          return {send: () => {}};
        }});

    expect(returnedCode).toStrictEqual(HttpStatus.FORBIDDEN);
    expect(loggedMessage).toStrictEqual(`Request from <${email}> to create product with name: ${name} for organization with ID: ${organizationId}`);
  });
  it('When create product Then correct status', async () => {
    let loggedMessage: string | undefined;
    const createdProduct: any = {};
    const id = '12345';
    const transformedProduct: Product = {
      id,
      name,
      organizationId,
      priceAmount,
      priceCurrency,
    };
    const createProduct = makeCreateProductCallback(
        // @ts-ignore
        {info: (message) => {
          loggedMessage = message;
        }},
        {
          findOne: () => {
            return {
              exec: () => {
                return {
                  administratorEmails: [email],
                };
              },
            };
          },
        },
        async () => organizationId,
        {
          create: (doc: any) => {
            createdProduct.id = doc.id;
            createdProduct.name = doc.name;
            createdProduct.organizationId = doc.organizationId;
            return {
              ...createdProduct,
              toJSON: () => transformedProduct,
            };
          },
        },
        () => transformedProduct,
    );

    let returnedCode: number | undefined;
    let returnedBody: any;
    await createProduct(
        // @ts-ignore
        {user: {email, emailVerified: true}, params: {organizationId}, body: {name, organizationId, priceAmount, priceCurrency}},
        {status: (code) => {
          returnedCode = code;
          return {
            json: (body) => {
              returnedBody = body;
            },
          };
        }});

    expect(returnedCode).toStrictEqual(HttpStatus.CREATED);
    expect(returnedBody).toStrictEqual(transformedProduct);
    expect(loggedMessage).toStrictEqual(`Request from <${email}> to create product with name: ${name} for organization with ID: ${organizationId}`);
  });
});
