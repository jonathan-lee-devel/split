import {GenerateIdFunction} from '@split-common/split-auth';
import {AuthenticatedEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {ModelTransformFunction} from '@split-common/split-service-config';
import Dinero, {Currency} from 'dinero.js';
import {Model} from 'mongoose';
import winston from 'winston';

import {Expense} from '../../../models';
import {GetPropertyByIdFunction} from '../../../util/property/get-property-by-id';
import {CreateExpenseRequestBody, CreateExpenseRequestQuery} from '../schemas/create-expense';

export const makeCreateExpenseCallback = (
    logger: winston.Logger,
    generateId: GenerateIdFunction,
    getPropertyById: GetPropertyByIdFunction,
    Expense: Model<Expense>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<CreateExpenseRequestBody, CreateExpenseRequestQuery> =>
  wrapTryCatchAuthenticated<CreateExpenseRequestBody, CreateExpenseRequestQuery>(async (req, res) => {
    const requestingUserEmail = req.user.email;
    const {propertyId, name, amount, currencyCode} = req.body;
    logger.info(`Request from <${requestingUserEmail}> to create property with name ${name}`);

    try {
      Dinero({amount, currency: currencyCode as Currency});
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({error: `Invalid amount or currency code provided`});
    }

    const associatedPropertyResponse = await getPropertyById(propertyId, String(req.headers['authorization']));
    if (!associatedPropertyResponse.property) {
      return res.status(associatedPropertyResponse.status).send();
    }
    if (!associatedPropertyResponse.property.administratorEmails.includes(requestingUserEmail)) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }

    const expense = await Expense.create({
      id: await generateId(),
      propertyId,
      name,
      amount,
      currencyCode,
      createdByEmail: requestingUserEmail,
    });

    return res.status(HttpStatus.CREATED).json(expense.toJSON({transform}));
  }) as any;
