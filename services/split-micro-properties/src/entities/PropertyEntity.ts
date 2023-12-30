import {Entity, ModelTransformFunction} from '@split-common/split-service-config';
import {Document, FilterQuery, Model, ObjectId} from 'mongoose';

export interface Property {
  id: string;
  createdByEmail: string;
  name: string;
  administratorEmails: Array<string>;
  tenantEmails: Array<string>;
  acceptedInvitationEmails: Array<string>;
}

export class PropertyEntity extends Entity<
  FilterQuery<Property>,
  Document<unknown, {}, Property> & Property & { _id: ObjectId; },
  Property> {
  constructor(
      private readonly propertyModel: Model<Property>,
      private readonly transform: ModelTransformFunction,
      body?: Document<unknown, {}, Property> & Property & { _id: ObjectId; } | undefined,
  ) {
    super(body);
  }

  async getBodyTransformed(): Promise<Property | undefined> {
    return (this.body) ? this.body.toJSON({transform: this.transform}) as any : undefined;
  }

  async getOne(filter: FilterQuery<Property>): Promise<PropertyEntity | null> {
    const resultingProperty = await this.propertyModel.findOne(filter).exec();
    return (resultingProperty) ? new PropertyEntity(this.propertyModel, this.transform, resultingProperty as any) : null;
  }

  async getOneTransformed(filter: FilterQuery<Property>): Promise<Property | null> {
    const resultingProperty = await this.propertyModel.findOne(filter).exec();
    return (resultingProperty) ? resultingProperty.toJSON({transform: this.transform}) : null;
  }

  async getMany(filter: FilterQuery<Property>): Promise<PropertyEntity[]> {
    const resultingProperties = await this.propertyModel.find(filter).exec();
    return resultingProperties.map((resultingProperty) => new PropertyEntity(this.propertyModel, this.transform, resultingProperty as any));
  }

  async getManyTransformed(filter: FilterQuery<Property>): Promise<Property[]> {
    const resultingProperties = await this.propertyModel.find(filter).exec();
    return resultingProperties.map((resultingProperty) => resultingProperty.toJSON({transform: this.transform}));
  }

  async create(entityData: Property): Promise<PropertyEntity | null> {
    const createdProperty = await this.propertyModel.create({...entityData});
    return (createdProperty) ? new PropertyEntity(this.propertyModel, this.transform, createdProperty as any) : null;
  }

  async createAndReturnTransformed(entityData: Property): Promise<Property | null> {
    const createResult = await this.propertyModel.create({...entityData});
    return (createResult) ? createResult.toJSON({transform: this.transform}) : null;
  }

  async updateOne(entityData: Property): Promise<void> {
    await this.updatePropertyById(entityData);
  }

  async updateOneAndReturnTransformed(entityData: Property): Promise<Property | null> {
    await this.updatePropertyById(entityData);
    const updatedProperty = await this.propertyModel.findOne({id: entityData.id}).exec();
    return (updatedProperty) ? updatedProperty.toJSON({transform: this.transform}) : null;
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
