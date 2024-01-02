import {MailToSendMessage, REGISTRATION_CONFIRMATION_EMAIL_SUBJECT, RegistrationStatus} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import {RabbitMQConnection} from '@split-common/split-service-config';

import {RegistrationVerificationTokenDto} from '../dtos';

export const makeMailService = (
    mailToSendRabbitMQConnectionPromise: Promise<RabbitMQConnection<MailToSendMessage>>,
    frontEndUrl: string,
) => {
  return {
    sendRegistrationVerificationEmail: async (email: string, token: RegistrationVerificationTokenDto) => {
      await (await mailToSendRabbitMQConnectionPromise).sendData('mail-to-send', {
        toEmail: email,
        subject: REGISTRATION_CONFIRMATION_EMAIL_SUBJECT,
        html: `<h4>Please click the following link to verify your account: <a href="${frontEndUrl}/register/confirm/${token.value}">Verify Account</a></h4>`,
      });
      return {status: HttpStatus.OK, data: {status: RegistrationStatus[RegistrationStatus.AWAITING_EMAIL_VERIFICATION]}};
    },
  };
};
