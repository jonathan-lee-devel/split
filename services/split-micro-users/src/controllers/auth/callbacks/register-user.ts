import {User} from '@split-common/split-auth';
import {MailToSendMessage, REGISTRATION_CONFIRMATION_EMAIL_SUBJECT, RegistrationStatus} from '@split-common/split-constants';
import {AnonymousEndpointCallback, HttpStatus, wrapTryCatchAnonymous} from '@split-common/split-http';
import {RabbitMQConnection} from '@split-common/split-service-config';
import {Model} from 'mongoose';
import winston from 'winston';

import {Environment} from '../../../environment';
import {EncodePasswordFunction} from '../../../util/password/encode-password';
import {GenerateRegistrationVerificationTokenFunction} from '../../../util/registration/generate-registration-verification-token';
import {HandleExistingUserFunction} from '../../../util/registration/handle-existing-user';
import {RegisterRequestBody, RegisterRequestQuery} from '../schemas/register';

export const makeRegisterUserCallback = (
    logger: winston.Logger,
    handleExistingUser: HandleExistingUserFunction,
    generateRegistrationVerificationToken: GenerateRegistrationVerificationTokenFunction,
    encodePassword: EncodePasswordFunction,
    User: Model<User>,
    rabbitMQConnection: Promise<RabbitMQConnection<MailToSendMessage>>,
    environment: Environment,
): AnonymousEndpointCallback<RegisterRequestBody, RegisterRequestQuery> =>
  wrapTryCatchAnonymous<RegisterRequestBody, RegisterRequestQuery>(async (req, res) => {
    const {email, firstName, lastName, password} = req.body;
    if (await handleExistingUser(email)) {
      return res.status(HttpStatus.CONFLICT).send();
    }

    const newUser: User = {
      id: '',
      email,
      firstName,
      lastName,
      password: await encodePassword(password),
      emailVerified: false,
      googleId: undefined,
    };
    const existingGoogleUser = await User.findOne({email}).exec();
    if (existingGoogleUser) {
      existingGoogleUser.firstName = newUser.firstName;
      existingGoogleUser.lastName = newUser.lastName;
      existingGoogleUser.password = newUser.password;
      await existingGoogleUser.save();
    } else {
      await User.create(newUser);
    }

    const registrationVerificationToken = await generateRegistrationVerificationToken(email);
    if (!registrationVerificationToken) {
      logger.error(`Error generating verification token for new user with e-mail: <${email}>`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }

    logger.info(`Registration process initiated for user: <${email}>`);
    await (await rabbitMQConnection).sendData('mail-to-send', {
      toEmail: email,
      subject: REGISTRATION_CONFIRMATION_EMAIL_SUBJECT,
      html: `<h4>Please click the following link to verify your account: <a href="${environment.FRONT_END_URL}/register/confirm/${registrationVerificationToken.value}">Verify Account</a></h4>`,
    });

    return res.status(HttpStatus.OK).json({status: RegistrationStatus[RegistrationStatus.AWAITING_EMAIL_VERIFICATION]});
  }) as any;
