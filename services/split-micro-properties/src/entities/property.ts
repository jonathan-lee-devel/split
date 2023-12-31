import {GenerateIdFunction} from '@split-common/split-auth';
import {HttpStatus} from '@split-common/split-http';

import {PropertyDAO} from '../dao';
import {PropertyDto} from '../dtos';

export const makePropertyEntity = (
    propertyDAO: PropertyDAO,
    generateId: GenerateIdFunction,
) => {
  const getPropertyForModificationWithErrors = async (requestingUserEmail: string, propertyId: string) => {
    const property = await propertyDAO.getOneTransformed({id: propertyId});
    if (!property) {
      return {status: HttpStatus.NOT_FOUND, error: `Property with ID: ${propertyId} not found`};
    }

    if (!property.administratorEmails.includes(requestingUserEmail)) {
      return {status: HttpStatus.FORBIDDEN, error: `${requestingUserEmail} is not allowed to modify property: ${property.name}`};
    }

    return {status: HttpStatus.OK, data: property};
  };

  const updatePropertyWithErrors = async (propertyData: PropertyDto) => {
    const updatedProperty = await propertyDAO.updateOneAndReturnTransformed(propertyData);
    return (updatedProperty) ?
      {status: HttpStatus.OK, data: updatedProperty} :
      {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Failed to update property with ID: ${propertyData.id}`};
  };

  return {
    createNewProperty: async (requestingUserEmail: string, name: string, tenantEmails: string[]) => {
      const createdProperty = await propertyDAO.createAndReturnTransformed({
        id: await generateId(),
        createdByEmail: requestingUserEmail,
        name,
        administratorEmails: [requestingUserEmail],
        tenantEmails,
        acceptedInvitationEmails: [requestingUserEmail],
      });
      return (createdProperty) ?
        {status: HttpStatus.CREATED, data: createdProperty} :
        {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Property with name: ${name} failed to create.`};
    },
    deletePropertyById: async (requestingUserEmail: string, propertyId: string) => {
      const property = await propertyDAO.getOneTransformed({id: propertyId});
      if (!property) {
        return {status: HttpStatus.NOT_FOUND, error: `Property with ID: ${propertyId} not found`};
      }
      if (!property.administratorEmails.includes(requestingUserEmail)) {
        return {status: HttpStatus.FORBIDDEN, error: `${requestingUserEmail} is not permitted to delete property with ID: ${propertyId}`};
      }
      const deletedProperty = await propertyDAO.deleteOneByIdAndReturnTransformed(propertyId);
      return (deletedProperty) ?
        {status: HttpStatus.OK, data: deletedProperty} :
        {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Property with ID: ${propertyId} could not be deleted`};
    },
    getPropertiesWhereInvolved: async (requestingUserEmail: string) => {
      return {
        status: HttpStatus.OK,
        data: await propertyDAO.getManyTransformed({
          $or: [
            {administratorEmails: requestingUserEmail},
            {tenantEmails: requestingUserEmail},
          ]}),
      };
    },
    togglePropertyAdministratorStatus: async (requestingUserEmail: string, propertyId: string, emailToToggle: string)=> {
      const getPropertyResponse = await getPropertyForModificationWithErrors(requestingUserEmail, propertyId);
      if (getPropertyResponse.status !== HttpStatus.OK) {
        return getPropertyResponse;
      }
      const property = getPropertyResponse.data!; // Known to be defined if status is OK

      if (!property.administratorEmails.includes(emailToToggle) &&
        !property.tenantEmails.includes(emailToToggle)) {
        return {status: HttpStatus.BAD_REQUEST, error: `E-mail: ${emailToToggle} is not an administrator or tenant`};
      }

      if (property.administratorEmails.includes(emailToToggle)) {
        if (property.administratorEmails.length === 1) {
          return {status: HttpStatus.BAD_REQUEST, error: `Property: ${property.name} requires at least one administrator`};
        }
        property.administratorEmails = property.administratorEmails.filter((administratorEmail) => administratorEmail !== emailToToggle);
      } else {
        property.administratorEmails.push(emailToToggle);
      }

      return updatePropertyWithErrors(property);
    },
    togglePropertyTenantStatus: async (requestingUserEmail: string, propertyId: string, emailToToggle: string) => {
      const getPropertyResponse = await getPropertyForModificationWithErrors(requestingUserEmail, propertyId);
      if (getPropertyResponse.status !== HttpStatus.OK) {
        return getPropertyResponse;
      }
      const property = getPropertyResponse.data!; // Known to be defined if status is OK

      if (!property.administratorEmails.includes(emailToToggle) &&
        !property.tenantEmails.includes(emailToToggle)) {
        return {status: HttpStatus.BAD_REQUEST, error: `E-mail: ${emailToToggle} is not an administrator or tenant`};
      }

      if (property.tenantEmails.includes(emailToToggle)) {
        property.tenantEmails.splice(property.tenantEmails.indexOf(emailToToggle), 1);
      } else {
        property.tenantEmails.push(emailToToggle);
      }

      return updatePropertyWithErrors(property);
    },
    getPropertyById: async (requestingUserEmail: string, propertyId: string) => {
      const property = await propertyDAO.getOneTransformed({id: propertyId});
      if (!property) {
        return {status: HttpStatus.NOT_FOUND, error: `Property with ID: ${propertyId} not found`};
      }

      if (!property.administratorEmails.includes(requestingUserEmail) &&
        !property.tenantEmails.includes(requestingUserEmail)) {
        return {status: HttpStatus.FORBIDDEN, error: `${requestingUserEmail} is not permitted to view property with ID: ${propertyId}`};
      }

      return {status: HttpStatus.OK, data: property};
    },
    verifyEmailToInvite: async (requestingUserEmail: string, propertyId: string, emailToInvite: string) => {
      const getPropertyResponse = await getPropertyForModificationWithErrors(requestingUserEmail, propertyId);
      if (getPropertyResponse.status !== HttpStatus.OK) {
        return getPropertyResponse;
      }
      const property = getPropertyResponse.data!; // Known to be defined if status is OK

      return (property.acceptedInvitationEmails.includes(emailToInvite)) ?
          {status: HttpStatus.BAD_REQUEST, error: `${emailToInvite} has already accepted invitation to property: ${property.name}`} :
          {status: HttpStatus.OK};
    },
    addTenantEmail: async (requestingUserEmail: string, propertyId: string, emailToAdd: string) => {
      const getPropertyResponse = await getPropertyForModificationWithErrors(requestingUserEmail, propertyId);
      if (getPropertyResponse.status !== HttpStatus.OK) {
        return getPropertyResponse;
      }
      const property = getPropertyResponse.data!; // Known to be defined if status is OK
      property.tenantEmails.push(emailToAdd);

      const updatedProperty = await propertyDAO.updateOneAndReturnTransformed(property);
      return (updatedProperty) ?
        {status: HttpStatus.OK, data: updatedProperty} :
        {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `${requestingUserEmail} could not add ${emailToAdd} to tenants of property with ID: ${propertyId}`};
    },
  };
};
