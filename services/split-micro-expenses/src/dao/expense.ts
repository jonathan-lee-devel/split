import {DAO, defaultModelTransform, ModelTransformFunction} from '@split-common/split-service-config';
import {Document, FilterQuery, Model, ObjectId, Promise} from 'mongoose';

import {ExpenseDto} from '../dtos';
import {Expense, ExpenseModel} from '../models';

export class ExpenseDAO implements DAO<
  FilterQuery<Expense>,
  Document<unknown, {}, Expense> & Expense & { _id: ObjectId},
  ExpenseDto> {
  constructor(
    private readonly expenseModel: Model<Expense>,
    private readonly transform: ModelTransformFunction,
  ) {}

  async getOneTransformed(filter: FilterQuery<Expense>): Promise<ExpenseDto | null> {
    const resultingExpense = await this.expenseModel.findOne(filter).exec();
    return (resultingExpense) ? resultingExpense.toJSON({transform: this.transform}) : null;
  }

  async getManyTransformed(filter: FilterQuery<Expense>): Promise<ExpenseDto[]> {
    const resultingExpenses = await this.expenseModel.find(filter).exec();
    return resultingExpenses.map((resultingExpense) => resultingExpense.toJSON({transform: this.transform}));
  }

  async createAndReturnTransformed(entityData: Expense): Promise<ExpenseDto | null> {
    const createResult = await this.expenseModel.create({...entityData});
    return (createResult) ? createResult.toJSON({transform: this.transform}) : null;
  }

  async updateOne(entityData: Expense): Promise<void> {
    await this.updateExpenseById(entityData);
  }

  async updateOneAndReturnTransformed(entityData: Expense): Promise<ExpenseDto | null> {
    await this.updateExpenseById(entityData);
    const updatedExpense = await this.expenseModel.findOne({id: entityData.id}).exec();
    return (updatedExpense) ? updatedExpense.toJSON({transform: this.transform}) : null;
  }

  async deleteOne(filter: FilterQuery<Expense>): Promise<void> {
    await this.expenseModel.deleteOne(filter).exec();
  }

  async deleteOneAndReturnTransformed(filter: FilterQuery<Expense>): Promise<ExpenseDto | null> {
    const expense = await this.expenseModel.findOne(filter).exec();
    await this.expenseModel.deleteOne(filter).exec();
    return (expense) ? expense.toJSON({transform: this.transform}) : null;
  }

  private async updateExpenseById(entityData: Expense): Promise<void> {
    await this.expenseModel.updateOne({id: entityData.id}, {
      $set: {
        'propertyId': entityData.propertyId,
        'name': entityData.name,
        'amount': entityData.amount,
        'currencyCode': entityData.currencyCode,
      },
    }).exec();
  }
}

export const makeDefaultExpenseDao = () => new ExpenseDAO(ExpenseModel, defaultModelTransform);
