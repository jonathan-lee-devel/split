import {GenerateIdFunction} from '@split-common/split-auth';
import {HttpStatus} from '@split-common/split-http';
import Dinero, {Currency} from 'dinero.js';
import winston from 'winston';

import {ExpenseDAO} from '../dao';

import {PropertyService} from './index';

export const makeExpenseService = (
    logger: winston.Logger,
    propertyService: PropertyService,
    expenseDao: ExpenseDAO,
    generateId: GenerateIdFunction,
) => (
  {
    createExpense: async (
        requestingUserEmail: string,
        authorizationHeader: string,
        propertyId: string,
        name: string,
        amount: number,
        currencyCode: string,
    ) => {
      let dineroAmount: Dinero.Dinero | undefined;
      try {
        const roundedAmount = Number(amount.toFixed(2));
        const roundedAmountAsInt = Math.trunc(roundedAmount * 100.00);
        dineroAmount = Dinero({amount: roundedAmountAsInt, currency: currencyCode as Currency});
      } catch (err) {
        logger.error(`Error while creating Dinero: ${err}`);
        return {status: HttpStatus.BAD_REQUEST, error: `Invalid amount or currency code provided`};
      }
      const associatedPropertyResponse = await propertyService.getPropertyById(propertyId, authorizationHeader);
      if (!associatedPropertyResponse.property) {
        return {status: associatedPropertyResponse.status};
      }
      if (!associatedPropertyResponse.property.administratorEmails.includes(requestingUserEmail)) {
        return {status: HttpStatus.FORBIDDEN, error: `${requestingUserEmail} is not allowed to modify property with ID: ${propertyId}`};
      }
      const createdExpense = await expenseDao.createAndReturnTransformed({
        id: await generateId(),
        propertyId,
        name,
        amount: dineroAmount.getAmount(),
        currencyCode: (currencyCode as Currency),
        createdByEmail: requestingUserEmail,
      });
      return (createdExpense) ?
        {status: HttpStatus.CREATED, data: createdExpense} :
        {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Error creating expense with name: ${name}`};
    },
    deleteExpenseById: async (requestingUserEmail: string, authorizationHeader: string, expenseId: string) => {
      const expense = await expenseDao.getOneTransformed({id: expenseId});
      if (!expense) {
        return {status: HttpStatus.NOT_FOUND, error: `Expense with ID: ${expenseId} not found`};
      }

      const associatedPropertyResponse = await propertyService.getPropertyById(expense.propertyId, authorizationHeader);
      if (!associatedPropertyResponse.property) {
        return {status: associatedPropertyResponse.status};
      }
      if (!associatedPropertyResponse.property.administratorEmails.includes(requestingUserEmail)) {
        return {status: HttpStatus.FORBIDDEN, error: `${requestingUserEmail} is not allowed to modify property with ID: ${expense.propertyId}`};
      }

      const deletedExpense = await expenseDao.deleteOneAndReturnTransformed({id: expenseId});
      return (deletedExpense) ?
        {status: HttpStatus.OK, data: deletedExpense} :
        {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Could not delete expense with ID: ${expenseId}`};
    },
    getExpenseById: async (requestingUserEmail: string, authorizationHeader: string, expenseId: string) => {
      const expense = await expenseDao.getOneTransformed({id: expenseId});
      if (!expense) {
        return {status: HttpStatus.NOT_FOUND, error: `Expense with ID: ${expenseId} not found`};
      }

      const associatedPropertyResponse = await propertyService.getPropertyById(expense.propertyId, authorizationHeader);
      if (!associatedPropertyResponse.property) {
        return {status: associatedPropertyResponse.status};
      }
      if (!associatedPropertyResponse.property.administratorEmails.includes(requestingUserEmail) &&
        !associatedPropertyResponse.property.tenantEmails.includes(requestingUserEmail)) {
        return {status: HttpStatus.FORBIDDEN, error: `Not permitted to view expense with ID: ${expenseId}`};
      }

      return {status: HttpStatus.OK, data: expense};
    },
    getExpensesForProperty: async (requestingUserEmail: string, authorizationHeader: string, propertyId: string) => {
      const expenses = await expenseDao.getManyTransformed({propertyId});
      if (!expenses) {
        return {status: HttpStatus.NOT_FOUND};
      }

      const associatedPropertyResponse = await propertyService.getPropertyById(propertyId, authorizationHeader);
      if (!associatedPropertyResponse.property) {
        return {status: associatedPropertyResponse.status};
      }
      if (!associatedPropertyResponse.property.administratorEmails.includes(requestingUserEmail) &&
        !associatedPropertyResponse.property.tenantEmails.includes(requestingUserEmail)) {
        return {status: HttpStatus.FORBIDDEN, error: `Not permitted to view expenses for property with ID: ${propertyId}`};
      }

      return {status: HttpStatus.OK, data: expenses};
    },
  }
);
