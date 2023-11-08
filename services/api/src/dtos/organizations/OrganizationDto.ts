import {Dto} from '../Dto';

export interface OrganizationDto extends Dto {
  id: string;
  name: string;
  administratorEmails: string[];
  memberEmails: string[];
}
