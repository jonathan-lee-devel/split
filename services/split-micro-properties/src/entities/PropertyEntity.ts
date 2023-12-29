import {Entity, ModelTransformFunction} from '@split-common/split-service-config';
import {Document, FilterQuery, Model} from 'mongoose';

export interface Property {
  id: string;
  createdByEmail: string;
  name: string;
  administratorEmails: Array<string>;
  tenantEmails: Array<string>;
  acceptedInvitationEmails: Array<string>;
}

export class PropertyEntity extends Entity<FilterQuery<Property>, Document<Property>, Property> {
  private readonly propertyModel: Model<Property>;
  private readonly transform: ModelTransformFunction;
  constructor(propertyModel: Model<Property>, transform: ModelTransformFunction, body?: Document<Property>) {
    super(body);
    this.propertyModel = propertyModel;
    this.transform = transform;
  }

  async create(entityData: Property): Promise<PropertyEntity | null> {
    const createdProperty = await this.propertyModel.create({...entityData});
    return (createdProperty) ? new PropertyEntity(this.propertyModel, this.transform, createdProperty as any) : null;
  }

  async getMany(filter: FilterQuery<Property>): Promise<PropertyEntity[]> {
    const resultingProperties = await this.propertyModel.find(filter).exec();
    return resultingProperties.map((resultingProperty) => new PropertyEntity(this.propertyModel, this.transform, resultingProperty as any));
  }

  async getOne(filter: FilterQuery<Property>): Promise<PropertyEntity | null> {
    const resultingProperty = await this.propertyModel.findOne(filter).exec();
    return (resultingProperty) ? new PropertyEntity(this.propertyModel, this.transform) : null;
  }

  async createAndReturnTransformed(entityData: Property): Promise<Property | null> {
    const createResult = await this.propertyModel.create({...entityData});
    return (createResult) ? createResult.toJSON({transform: this.transform}) : null;
  }

  async getManyTransformed(filter: FilterQuery<Property>): Promise<Property[]> {
    const resultingProperties = await this.propertyModel.find(filter).exec();
    return resultingProperties.map((resultingProperty) => resultingProperty.toJSON({transform: this.transform}));
  }

  async getOneTransformed(filter: FilterQuery<Property>): Promise<Property | null> {
    const resultingProperty = await this.propertyModel.findOne(filter).exec();
    return (resultingProperty) ? resultingProperty.toJSON({transform: this.transform}) : null;
  }
}
