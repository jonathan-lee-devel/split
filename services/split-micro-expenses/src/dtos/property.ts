import {Dto} from '@split-common/split-http';

export interface PropertyDto extends Dto {
  id: string;
  createdByEmail: string;
  name: string;
  administratorEmails: string[];
  tenantEmails: string[];
  acceptedInvitationEmails: string[];
}
