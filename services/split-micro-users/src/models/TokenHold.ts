import {TokenHold, tokenHoldModelSchema} from '@split-common/split-auth';
import {model} from 'mongoose';

export const TokenHoldModel = model<TokenHold>('TokenHold', tokenHoldModelSchema);
