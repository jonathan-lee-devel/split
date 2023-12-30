import {Entity, ModelTransformFunction} from '@split-common/split-service-config';
import {Document, FilterQuery, Model, ObjectId} from 'mongoose';

import {PropertyInvitationVerificationTokenDto} from '../dtos';

export interface PropertyInvitationVerificationToken {
  id: string;
  value: string;
  expiryDate: Date;
  userEmail: string;
  propertyId: string;
  isAccepted: boolean;
}

export class PropertyInvitationVerificationTokenEntity extends Entity<
  FilterQuery<PropertyInvitationVerificationToken>,
  Document<unknown, {}, PropertyInvitationVerificationToken> & PropertyInvitationVerificationToken & { _id: ObjectId; },
  PropertyInvitationVerificationToken,
  PropertyInvitationVerificationTokenDto> {
  constructor(
    private readonly propertyInvitationVerificationTokenModel: Model<PropertyInvitationVerificationToken>,
    private readonly transform: ModelTransformFunction,
    body?: Document<unknown, {}, PropertyInvitationVerificationToken> & PropertyInvitationVerificationToken & { _id: ObjectId; },
  ) {
    super(body);
  }

  async getBodyTransformed(): Promise<PropertyInvitationVerificationToken | undefined> {
    return (this.body) ? this.body.toJSON({transform: this.transform}) as any : undefined;
  }

  async getOne(filter: FilterQuery<PropertyInvitationVerificationToken>): Promise<PropertyInvitationVerificationTokenEntity | null> {
    const resultingToken = await this.propertyInvitationVerificationTokenModel.findOne(filter).exec();
    return (resultingToken) ?
      new PropertyInvitationVerificationTokenEntity(this.propertyInvitationVerificationTokenModel, this.transform, resultingToken as any) :
      null;
  }

  async getOneTransformed(filter: FilterQuery<PropertyInvitationVerificationToken>)
    : Promise<PropertyInvitationVerificationTokenDto | null> {
    const resultingToken = await this.propertyInvitationVerificationTokenModel.findOne(filter).exec();
    return (resultingToken) ?
      resultingToken.toJSON({transform: this.transform}) :
      null;
  }

  async getMany(filter: FilterQuery<PropertyInvitationVerificationToken>): Promise<PropertyInvitationVerificationTokenEntity[]> {
    const resultingTokens = await this.propertyInvitationVerificationTokenModel.find(filter).exec();
    return resultingTokens
        .map((resultingToken) => new PropertyInvitationVerificationTokenEntity(
            this.propertyInvitationVerificationTokenModel,
            this.transform,
          resultingToken as any,
        ));
  }

  async getManyTransformed(filter: FilterQuery<PropertyInvitationVerificationToken>)
    : Promise<PropertyInvitationVerificationTokenDto[]> {
    const resultingTokens = await this.propertyInvitationVerificationTokenModel.find(filter).exec();
    return resultingTokens
        .map((resultingToken) => resultingToken.toJSON({transform: this.transform}));
  }

  async create(entityData: PropertyInvitationVerificationToken): Promise<PropertyInvitationVerificationTokenEntity | null> {
    const createdToken = await this.propertyInvitationVerificationTokenModel.create({...entityData});
    return (createdToken) ?
      new PropertyInvitationVerificationTokenEntity(this.propertyInvitationVerificationTokenModel, this.transform, createdToken as any) :
      null;
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
