import {makeGenerateId} from '@split-common/split-auth';

import {makeExpenseService} from './expense';
import {makePropertyService} from './property';
import {makeDefaultExpenseDao} from '../dao';
import {environment} from '../environment';
import logger from '../logger';

const generateId = makeGenerateId(logger);

const defaultExpenseDao = makeDefaultExpenseDao();

export const propertyService = makePropertyService(
    logger,
    environment.NODE_ENV,
);

export type PropertyService = typeof propertyService;

export const expenseService = makeExpenseService(
    logger,
    propertyService,
    defaultExpenseDao,
    generateId,
);

export type ExpenseService = typeof expenseService;
