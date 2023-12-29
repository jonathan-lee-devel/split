import {AuthenticatedEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {ModelTransformFunction} from '@split-common/split-service-config';
import {Model} from 'mongoose';
import winston from 'winston';

import {Expense} from '../../../models';
import {GetPropertyByIdFunction} from '../../../util/property/get-property-by-id';
import {GetExpenseByIdRequestBody, GetExpenseByIdRequestQuery} from '../schemas/get-expense-by-id';

export const makeDeleteExpenseByIdCallback = (
    logger: winston.Logger,
    Expense: Model<Expense>,
    getPropertyById: GetPropertyByIdFunction,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<GetExpenseByIdRequestBody, GetExpenseByIdRequestQuery> =>
  wrapTryCatchAuthenticated<GetExpenseByIdRequestBody, GetExpenseByIdRequestQuery>(async (req, res) => {
    const requestingUserEmail = req.user.email;
    const {expenseId} = req.params;
    logger.info(`Request from <${requestingUserEmail}> to delete expense with ID: ${expenseId}`);

    const expense = await Expense.findOne({id: expenseId}).exec();
    if (!expense) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    const associatedPropertyResponse = await getPropertyById(expense.propertyId, String(req.headers['authorization']));
    if (!associatedPropertyResponse.property) {
      return res.status(associatedPropertyResponse.status).send();
    }
    if (!associatedPropertyResponse.property.administratorEmails.includes(requestingUserEmail)) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }

    await Expense.deleteOne({id: expenseId}).exec();

    return res.status(HttpStatus.OK).json(expense.toJSON({transform}));
  }) as any;
