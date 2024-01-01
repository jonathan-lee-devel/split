import {User} from '@split-common/split-auth';
import {DAO, defaultModelTransform, ModelTransformFunction} from '@split-common/split-service-config';
import {Document, FilterQuery, Model, ObjectId} from 'mongoose';

import {UserDto} from '../dtos';
import {UserModel} from '../models';

export class UserDAO implements DAO<
  FilterQuery<User>,
  Document<unknown, {}, User> & User & { _id: ObjectId; },
  UserDto> {
  constructor(
      private readonly userModel: Model<User>,
      private readonly transform: ModelTransformFunction,
  ) {}

  async getOneTransformed(filter: FilterQuery<User>): Promise<UserDto | null> {
    const resultingUser = await this.userModel.findOne(filter).exec();
    return (resultingUser) ? resultingUser.toJSON({transform: this.transform}) : null;
  }

  async getManyTransformed(filter: FilterQuery<User>): Promise<UserDto[]> {
    const resultingUsers = await this.userModel.find(filter).exec();
    return resultingUsers.map((resultingProperty) => resultingProperty.toJSON({transform: this.transform}));
  }

  async createAndReturnTransformed(entityData: User): Promise<UserDto | null> {
    const createResult = await this.userModel.create({...entityData});
    return (createResult) ? createResult.toJSON({transform: this.transform}) : null;
  }

  async updateOne(entityData: User): Promise<void> {
    await this.updateUserById(entityData);
  }

  async updateOneAndReturnTransformed(entityData: User): Promise<UserDto | null> {
    await this.updateUserById(entityData);
    const updatedUser = await this.userModel.findOne({id: entityData.id}).exec();
    return (updatedUser) ? updatedUser.toJSON({transform: this.transform}) : null;
  }

  async deleteOneById(entityId: string): Promise<void> {
    await this.userModel.deleteOne({id: entityId}).exec();
  }

  async deleteOneByIdAndReturnTransformed(entityId: string): Promise<UserDto | null> {
    const user = await this.userModel.findOne({id: entityId}).exec();
    await this.userModel.deleteOne({id: entityId}).exec();
    return (user) ? user.toJSON({transform: this.transform}) : null;
  }

  private async updateUserById(entityData: User): Promise<void> {
    await this.userModel.updateOne({id: entityData.id}, {
      $set: {
        'firstName': entityData.firstName,
        'lastName': entityData.lastName,
        'password': entityData.password,
        'emailVerified': entityData.emailVerified,
        'googleId': entityData.googleId,
      },
    }).exec();
  }
}
export const makeDefaultUserDao = () => new UserDAO(UserModel, defaultModelTransform);
