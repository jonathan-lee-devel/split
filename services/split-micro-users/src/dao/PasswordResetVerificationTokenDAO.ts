import {PasswordResetVerificationToken} from '@split-common/split-auth';
import {DAO, defaultModelTransform, ModelTransformFunction} from '@split-common/split-service-config';
import {Document, FilterQuery, Model, ObjectId} from 'mongoose';

import {PasswordResetVerificationTokenDto} from '../dtos';
import {PasswordResetVerificationTokenModel} from '../models';

export class PasswordResetVerificationTokenDAO implements DAO<
  FilterQuery<PasswordResetVerificationToken>,
  Document<unknown, {}, PasswordResetVerificationToken> & PasswordResetVerificationToken & { _id: ObjectId; },
  PasswordResetVerificationToken> {
  constructor(
      private readonly passwordResetVerificationTokenModel: Model<PasswordResetVerificationToken>,
      private readonly transform: ModelTransformFunction,
  ) {}

  async getOneTransformed(filter: FilterQuery<PasswordResetVerificationToken>): Promise<PasswordResetVerificationTokenDto | null> {
    const resultingPasswordResetVerificationToken = await this.passwordResetVerificationTokenModel.findOne(filter).exec();
    return (resultingPasswordResetVerificationToken) ? resultingPasswordResetVerificationToken.toJSON({transform: this.transform}) : null;
  }

  async getManyTransformed(filter: FilterQuery<PasswordResetVerificationToken>): Promise<PasswordResetVerificationTokenDto[]> {
    const resultingPasswordResetVerificationTokens = await this.passwordResetVerificationTokenModel.find(filter).exec();
    return resultingPasswordResetVerificationTokens.map((resultingProperty) => resultingProperty.toJSON({transform: this.transform}));
  }

  async createAndReturnTransformed(entityData: PasswordResetVerificationToken): Promise<PasswordResetVerificationTokenDto | null> {
    const createResult = await this.passwordResetVerificationTokenModel.create({...entityData});
    return (createResult) ? createResult.toJSON({transform: this.transform}) : null;
  }

  async updateOne(entityData: PasswordResetVerificationToken): Promise<void> {
    await this.updatePasswordResetVerificationTokenById(entityData);
  }

  async updateOneAndReturnTransformed(entityData: PasswordResetVerificationToken): Promise<PasswordResetVerificationTokenDto | null> {
    await this.updatePasswordResetVerificationTokenById(entityData);
    const updatedPasswordResetVerificationToken = await this.passwordResetVerificationTokenModel.findOne({id: entityData.id}).exec();
    return (updatedPasswordResetVerificationToken) ? updatedPasswordResetVerificationToken.toJSON({transform: this.transform}) : null;
  }

  async deleteOne(filter: FilterQuery<PasswordResetVerificationToken>): Promise<void> {
    await this.passwordResetVerificationTokenModel.deleteOne(filter).exec();
  }

  async deleteOneAndReturnTransformed(filter: FilterQuery<PasswordResetVerificationToken>)
    : Promise<PasswordResetVerificationTokenDto | null> {
    const registrationVerificationToken = await this.passwordResetVerificationTokenModel.findOne(filter).exec();
    await this.passwordResetVerificationTokenModel.deleteOne(filter).exec();
    return (registrationVerificationToken) ? registrationVerificationToken.toJSON({transform: this.transform}) : null;
  }

  private async updatePasswordResetVerificationTokenById(entityData: PasswordResetVerificationToken): Promise<void> {
    await this.passwordResetVerificationTokenModel.updateOne({id: entityData.id}, {
      $set: {
        'value': entityData.value,
        'expiryDate': entityData.expiryDate,
        'userEmail': entityData.userEmail,
      },
    }).exec();
  }
}
export const makeDefaultPasswordResetVerificationTokenDao =
  () => new PasswordResetVerificationTokenDAO(
      PasswordResetVerificationTokenModel,
      defaultModelTransform,
  );
