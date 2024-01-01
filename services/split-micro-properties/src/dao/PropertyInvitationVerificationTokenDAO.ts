import {DAO, defaultModelTransform, ModelTransformFunction} from '@split-common/split-service-config';
import {Document, FilterQuery, Model, ObjectId} from 'mongoose';

import {PropertyInvitationVerificationTokenDto} from '../dtos';
import {PropertyInvitationVerificationTokenModel} from '../models';

export interface PropertyInvitationVerificationToken {
  id: string;
  value: string;
  expiryDate: Date;
  userEmail: string;
  propertyId: string;
  isAccepted: boolean;
}

export class PropertyInvitationVerificationTokenDAO implements DAO<
  FilterQuery<PropertyInvitationVerificationToken>,
  Document<unknown, {}, PropertyInvitationVerificationToken> & PropertyInvitationVerificationToken & { _id: ObjectId; },
  PropertyInvitationVerificationTokenDto> {
  constructor(
    private readonly propertyInvitationVerificationTokenModel: Model<PropertyInvitationVerificationToken>,
    private readonly transform: ModelTransformFunction,
  ) {}

  async getOneTransformed(filter: FilterQuery<PropertyInvitationVerificationToken>)
    : Promise<PropertyInvitationVerificationTokenDto | null> {
    const resultingToken = await this.propertyInvitationVerificationTokenModel.findOne(filter).exec();
    return (resultingToken) ?
      resultingToken.toJSON({transform: this.transform}) :
      null;
  }

  async getManyTransformed(filter: FilterQuery<PropertyInvitationVerificationToken>)
    : Promise<PropertyInvitationVerificationTokenDto[]> {
    const resultingTokens = await this.propertyInvitationVerificationTokenModel.find(filter).exec();
    return resultingTokens
        .map((resultingToken) => resultingToken.toJSON({transform: this.transform}));
  }

  async createAndReturnTransformed(entityData: PropertyInvitationVerificationToken)
    : Promise<PropertyInvitationVerificationTokenDto | null> {
    const createdToken = await this.propertyInvitationVerificationTokenModel.create({...entityData});
    return (createdToken) ?
      createdToken.toJSON({transform: this.transform}) :
      null;
  }

  async updateOne(entityData: PropertyInvitationVerificationToken): Promise<void> {
    await this.updateTokenById(entityData);
  }

  async updateOneAndReturnTransformed(entityData: PropertyInvitationVerificationToken)
    : Promise<PropertyInvitationVerificationTokenDto | null> {
    await this.updateTokenById(entityData);
    const updatedToken = await this.propertyInvitationVerificationTokenModel.findOne({id: entityData.id}).exec();
    return (updatedToken) ? updatedToken.toJSON({transform: this.transform}) : null;
  }

  async deleteOne(filter: FilterQuery<PropertyInvitationVerificationToken>): Promise<void> {
    await this.propertyInvitationVerificationTokenModel.deleteOne(filter).exec();
  }

  async deleteOneAndReturnTransformed(filter: FilterQuery<PropertyInvitationVerificationToken>)
    : Promise<PropertyInvitationVerificationTokenDto | null> {
    const deletedToken = await this.propertyInvitationVerificationTokenModel.findOne(filter).exec();
    await this.propertyInvitationVerificationTokenModel.deleteOne(filter).exec();
    return (deletedToken) ?
      deletedToken.toJSON({transform: this.transform}) :
      null;
  }

  private async updateTokenById(entityData: PropertyInvitationVerificationToken): Promise<void> {
    await this.propertyInvitationVerificationTokenModel.updateOne({id: entityData.id}, {
      $set: {
        'value': entityData.value,
        'expiryDate': entityData.expiryDate,
        'userEmail': entityData.userEmail,
        'propertyId': entityData.propertyId,
        'isAccepted': entityData.isAccepted,
      },
    }).exec();
  }
}

export const makeDefaultPropertyInvitationVerificationTokenDao = () => new PropertyInvitationVerificationTokenDAO(
    PropertyInvitationVerificationTokenModel,
    defaultModelTransform,
);
