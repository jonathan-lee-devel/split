import {TokenHold} from '@split-common/split-auth';
import {DAO, defaultModelTransform, ModelTransformFunction} from '@split-common/split-service-config';
import {Document, FilterQuery, Model, ObjectId} from 'mongoose';

import {TokenHoldDto} from '../dtos';
import {TokenHoldModel} from '../models';

export class TokenHoldDAO implements DAO<
  FilterQuery<TokenHold>,
  Document<unknown, {}, TokenHold> & TokenHold & { _id: ObjectId; },
  TokenHoldDto> {
  constructor(
      private readonly passwordResetVerificationTokenModel: Model<TokenHold>,
      private readonly transform: ModelTransformFunction,
  ) {}

  async getOneTransformed(filter: FilterQuery<TokenHold>): Promise<TokenHoldDto | null> {
    const resultingTokenHold = await this.passwordResetVerificationTokenModel.findOne(filter).exec();
    return (resultingTokenHold) ? resultingTokenHold.toJSON({transform: this.transform}) : null;
  }

  async getManyTransformed(filter: FilterQuery<TokenHold>): Promise<TokenHoldDto[]> {
    const resultingTokenHolds = await this.passwordResetVerificationTokenModel.find(filter).exec();
    return resultingTokenHolds.map((resultingProperty) => resultingProperty.toJSON({transform: this.transform}));
  }

  async createAndReturnTransformed(entityData: TokenHold): Promise<TokenHoldDto | null> {
    const createResult = await this.passwordResetVerificationTokenModel.create({...entityData});
    return (createResult) ? createResult.toJSON({transform: this.transform}) : null;
  }

  async updateOne(entityData: TokenHold): Promise<void> {
    await this.updateTokenHoldById(entityData);
  }

  async updateOneAndReturnTransformed(entityData: TokenHold): Promise<TokenHoldDto | null> {
    await this.updateTokenHoldById(entityData);
    const updatedTokenHold = await this.passwordResetVerificationTokenModel.findOne({id: entityData.id}).exec();
    return (updatedTokenHold) ? updatedTokenHold.toJSON({transform: this.transform}) : null;
  }

  async deleteOne(filter: FilterQuery<TokenHold>): Promise<void> {
    await this.passwordResetVerificationTokenModel.deleteOne(filter).exec();
  }

  async deleteOneAndReturnTransformed(filter: FilterQuery<TokenHold>)
    : Promise<TokenHoldDto | null> {
    const registrationVerificationToken = await this.passwordResetVerificationTokenModel.findOne(filter).exec();
    await this.passwordResetVerificationTokenModel.deleteOne(filter).exec();
    return (registrationVerificationToken) ? registrationVerificationToken.toJSON({transform: this.transform}) : null;
  }

  private async updateTokenHoldById(entityData: TokenHold): Promise<void> {
    await this.passwordResetVerificationTokenModel.updateOne({id: entityData.id}, {
      $set: {
        'email': entityData.email,
        'token': entityData.token,
        'tokenCode': entityData.tokenCode,
        'refreshToken': entityData.refreshToken,
        'expiryDate': entityData.expiryDate,
      },
    }).exec();
  }
}
export const makeDefaultTokenHoldDao =
  () => new TokenHoldDAO(
      TokenHoldModel,
      defaultModelTransform,
  );
