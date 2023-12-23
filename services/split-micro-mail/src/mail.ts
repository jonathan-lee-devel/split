import {makeGenerateId} from '@split-common/split-auth';
import {EmailSendAttemptModel, makeSendMail, transporterConfig} from '@split-common/split-mail';

import {environment} from './environment';
import logger from './logger';

export const sendMail = makeSendMail(
    logger,
    environment.NODE_ENV,
    environment.EMAIL_USER,
    EmailSendAttemptModel,
    makeGenerateId(logger),
    transporterConfig(environment.EMAIL_USER, environment.EMAIL_PASSWORD),
);
