import {Dto} from '../Dto';

export interface PropertyDto extends Dto {
    name: string;
    administratorEmails: string[];
    tenantEmails: string[];
    acceptedInvitationEmails: string[],
    createdByEmail: string;
}

export const initialPropertyDto: PropertyDto = {
  id: '',
  name: '',
  createdByEmail: '',
  administratorEmails: [],
  tenantEmails: [],
  acceptedInvitationEmails: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
