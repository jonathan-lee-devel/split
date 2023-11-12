import {Dto} from '../Dto';

export interface PropertyDto extends Dto {
    name: string;
    administratorEmails: string[];
    tenantEmails: string[];
}
