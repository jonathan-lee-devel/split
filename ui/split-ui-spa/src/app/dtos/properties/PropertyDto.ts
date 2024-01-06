import {Dto} from '../Dto';

export class PropertyDto extends Dto {
  name: string = '';
  administratorEmails: string[] = [];
  tenantEmails: string[] = [];
  acceptedInvitationEmails: string[] = [];
  createdByEmail: string = '';
}

export const initialPropertyDto: PropertyDto = new PropertyDto();
