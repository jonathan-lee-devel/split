import {DAO, defaultModelTransform, ModelTransformFunction} from '@split-common/split-service-config';
import {Document, FilterQuery, Model, ObjectId} from 'mongoose';

import {PropertyDto} from '../dtos';
import {PropertyModel} from '../models';

export interface Property {
  id: string;
  createdByEmail: string;
  name: string;
  administratorEmails: Array<string>;
  tenantEmails: Array<string>;
  acceptedInvitationEmails: Array<string>;
}

export class PropertyDAO implements DAO<
  FilterQuery<Property>,
  Document<unknown, {}, Property> & Property & { _id: ObjectId; },
  PropertyDto> {
  constructor(
      private readonly propertyModel: Model<Property>,
      private readonly transform: ModelTransformFunction,
  ) {}

  async getOneTransformed(filter: FilterQuery<Property>): Promise<PropertyDto | null> {
    const resultingProperty = await this.propertyModel.findOne(filter).exec();
    return (resultingProperty) ? resultingProperty.toJSON({transform: this.transform}) : null;
  }

  async getManyTransformed(filter: FilterQuery<Property>): Promise<PropertyDto[]> {
    const resultingProperties = await this.propertyModel.find(filter).exec();
    return resultingProperties.map((resultingProperty) => resultingProperty.toJSON({transform: this.transform}));
  }

  async createAndReturnTransformed(entityData: Property): Promise<PropertyDto | null> {
    const createResult = await this.propertyModel.create({...entityData});
    return (createResult) ? createResult.toJSON({transform: this.transform}) : null;
  }

  async updateOne(entityData: Property): Promise<void> {
    await this.updatePropertyById(entityData);
  }

  async updateOneAndReturnTransformed(entityData: Property): Promise<PropertyDto | null> {
    await this.updatePropertyById(entityData);
    const updatedProperty = await this.propertyModel.findOne({id: entityData.id}).exec();
    return (updatedProperty) ? updatedProperty.toJSON({transform: this.transform}) : null;
  }

  async deleteOne(filter: FilterQuery<Property>): Promise<void> {
    await this.propertyModel.deleteOne(filter).exec();
  }

  async deleteOneAndReturnTransformed(filter: FilterQuery<Property>): Promise<PropertyDto | null> {
    const property = await this.propertyModel.findOne(filter).exec();
    await this.propertyModel.deleteOne(filter).exec();
    return (property) ? property.toJSON({transform: this.transform}) : null;
  }

  private async updatePropertyById(entityData: Property): Promise<void> {
    await this.propertyModel.updateOne({id: entityData.id}, {
      $set: {
        'name': entityData.name,
        'administratorEmails': entityData.administratorEmails,
        'tenantEmails': entityData.tenantEmails,
        'acceptedInvitationEmails': entityData.acceptedInvitationEmails,
        'createdByEmail': entityData.createdByEmail,
      },
    }).exec();
  }
}

export const makeDefaultPropertyDao = () => new PropertyDAO(PropertyModel, defaultModelTransform);
