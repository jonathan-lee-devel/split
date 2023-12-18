import {PasswordResetVerificationToken, passwordResetVerificationTokenModelSchema} from '@split-common/split-auth';
import {model} from 'mongoose';

export const PasswordResetVerificationTokenModel = model<PasswordResetVerificationToken>('PasswordResetVerificationToken', passwordResetVerificationTokenModelSchema);
