import {RegistrationVerificationToken, registrationVerificationTokenModelSchema} from '@split-common/split-auth';
import {model} from 'mongoose';

export const RegistrationVerificationTokenModel = model<RegistrationVerificationToken>('RegistrationVerificationToken', registrationVerificationTokenModelSchema);
