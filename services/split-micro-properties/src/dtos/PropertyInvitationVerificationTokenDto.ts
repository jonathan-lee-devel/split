import {Dto} from '@split-common/split-http';

export interface PropertyInvitationVerificationTokenDto extends Dto {
  id: string;
  value: string;
  expiryDate: Date;
  userEmail: string;
  propertyId: string;
  isAccepted: boolean;
}
