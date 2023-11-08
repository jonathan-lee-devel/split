import winston from 'winston';
import {Model} from 'mongoose';
import {User} from '../../../models/users/User';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {RegisterUserRequestBody, RegisterUserRequestQuery} from '../schemas/register-user';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {HandleExistingUserFunction} from '../../../util/registration/handle-existing-user';
import {GenerateRegistrationVerificationTokenFunction} from '../../../util/registration/generate-registration-verification-token';
import {SendMailFunction} from '../../../util/email/send-mail';
import {Environment} from '../../../environment';
import {REGISTRATION_CONFIRMATION_EMAIL_SUBJECT} from '../../../constants/registration/registration';
import {EncodePasswordFunction} from '../../../util/password/encode-password';
import {GeneratePasswordResetVerificationTokenFunction} from '../../../util/password/generate-password-reset-verification-token';
import {RegistrationStatus} from '../../../lib/enums/registration/RegistrationStatus';

export const makeRegisterUserCallback = (
    logger: winston.Logger,
    handleExistingUser: HandleExistingUserFunction,
    generateRegistrationVerificationToken: GenerateRegistrationVerificationTokenFunction,
    generatePasswordResetVerificationToken: GeneratePasswordResetVerificationTokenFunction,
    encodePassword: EncodePasswordFunction,
    User: Model<User>,
    sendMail: SendMailFunction,
    environment: Environment,
): AnonymousEndpointCallback<RegisterUserRequestBody, RegisterUserRequestQuery> => async (req, res) => {
  const {email, firstName, lastName, password, confirmPassword} = req.body;
  if (await handleExistingUser(email)) {
    return res.status(HttpStatus.CONFLICT).send();
  }
  if (password !== confirmPassword) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: 'Passwords do not match'});
  }

  const newUser: User = {
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
  if (!registrationVerificationToken || !await generatePasswordResetVerificationToken(email)) {
    logger.error(`Error generating verification token for new user with e-mail: <${email}>`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }

  // Mail is slow to send and can be sent asynchronously, hence, no await
  sendMail(email, REGISTRATION_CONFIRMATION_EMAIL_SUBJECT,
      `<h4>Please click the following link to verify your account: <a href="${environment.FRONT_END_URL}/register/confirm/${registrationVerificationToken.value}">Verify Account</a></h4>`)
      .catch((reason) => {
        logger.error(`Error sending e-mail: ${reason}`);
      });

  return res.status(HttpStatus.OK).json({status: RegistrationStatus[RegistrationStatus.AWAITING_EMAIL_VERIFICATION]});
};
