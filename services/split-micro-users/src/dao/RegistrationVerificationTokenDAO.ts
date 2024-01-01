import {RegistrationVerificationToken} from '@split-common/split-auth';
import {DAO, defaultModelTransform, ModelTransformFunction} from '@split-common/split-service-config';
import {Document, FilterQuery, Model, ObjectId} from 'mongoose';

import {RegistrationVerificationTokenDto} from '../dtos';
import {RegistrationVerificationTokenModel} from '../models';

export class RegistrationVerificationTokenDAO implements DAO<
  FilterQuery<RegistrationVerificationToken>,
  Document<unknown, {}, RegistrationVerificationToken> & RegistrationVerificationToken & { _id: ObjectId; },
  RegistrationVerificationToken> {
  constructor(
      private readonly registrationVerificationTokenModel: Model<RegistrationVerificationToken>,
      private readonly transform: ModelTransformFunction,
  ) {}

  async getOneTransformed(filter: FilterQuery<RegistrationVerificationToken>): Promise<RegistrationVerificationTokenDto | null> {
    const resultingRegistrationVerificationToken = await this.registrationVerificationTokenModel.findOne(filter).exec();
    return (resultingRegistrationVerificationToken) ? resultingRegistrationVerificationToken.toJSON({transform: this.transform}) : null;
  }

  async getManyTransformed(filter: FilterQuery<RegistrationVerificationToken>): Promise<RegistrationVerificationTokenDto[]> {
    const resultingRegistrationVerificationTokens = await this.registrationVerificationTokenModel.find(filter).exec();
    return resultingRegistrationVerificationTokens.map((resultingProperty) => resultingProperty.toJSON({transform: this.transform}));
  }

  async createAndReturnTransformed(entityData: RegistrationVerificationToken): Promise<RegistrationVerificationTokenDto | null> {
    const createResult = await this.registrationVerificationTokenModel.create({...entityData});
    return (createResult) ? createResult.toJSON({transform: this.transform}) : null;
  }

  async updateOne(entityData: RegistrationVerificationToken): Promise<void> {
    await this.updateRegistrationVerificationTokenById(entityData);
  }

  async updateOneAndReturnTransformed(entityData: RegistrationVerificationToken): Promise<RegistrationVerificationTokenDto | null> {
    await this.updateRegistrationVerificationTokenById(entityData);
    const updatedRegistrationVerificationToken = await this.registrationVerificationTokenModel.findOne({id: entityData.id}).exec();
    return (updatedRegistrationVerificationToken) ? updatedRegistrationVerificationToken.toJSON({transform: this.transform}) : null;
  }

  async deleteOne(filter: FilterQuery<RegistrationVerificationToken>): Promise<void> {
    await this.registrationVerificationTokenModel.deleteOne(filter).exec();
  }

  async deleteOneAndReturnTransformed(filter: FilterQuery<RegistrationVerificationToken>)
    : Promise<RegistrationVerificationTokenDto | null> {
    const registrationVerificationToken = await this.registrationVerificationTokenModel.findOne(filter).exec();
    await this.registrationVerificationTokenModel.deleteOne(filter).exec();
    return (registrationVerificationToken) ? registrationVerificationToken.toJSON({transform: this.transform}) : null;
  }

  private async updateRegistrationVerificationTokenById(entityData: RegistrationVerificationToken): Promise<void> {
    await this.registrationVerificationTokenModel.updateOne({id: entityData.id}, {
      $set: {
        'value': entityData.value,
        'expiryDate': entityData.expiryDate,
        'userEmail': entityData.userEmail,
      },
    }).exec();
  }
}
export const makeDefaultRegistrationVerificationTokenDao =
  () => new RegistrationVerificationTokenDAO(
      RegistrationVerificationTokenModel,
      defaultModelTransform,
  );
