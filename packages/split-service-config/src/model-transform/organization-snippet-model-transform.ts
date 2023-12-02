import {deleteMongoIdentifierAndVersionKey, ModelTransformFunction} from './default-model-transform';
import {IfAny, Types} from 'mongoose';

export const makeOrganizationSnippetModelTransform = (): ModelTransformFunction => (
    _doc: Document & unknown extends
    { _id?: infer U } ?
    IfAny<U, { _id: Types.ObjectId }, Required<{ _id: U }>> :
    { _id: Types.ObjectId },
    ret: Record<string, any>): void => {
  deleteMongoIdentifierAndVersionKey(ret);
  delete ret.administratorEmails;
  delete ret.memberEmails;
};

export const organizationSnippetModelTransform = makeOrganizationSnippetModelTransform();
