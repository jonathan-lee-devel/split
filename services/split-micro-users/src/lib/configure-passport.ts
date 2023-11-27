import passport from 'passport';
import {ExtractJwt, Strategy, VerifiedCallback} from 'passport-jwt';
import {environment} from '../environment';
import passportGoogle from 'passport-google-oauth20';
import {UserModel} from '../models/users/User';
import logger from '../logger';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: environment.JWT_SECRET,
  passReqToCallback: true,
};

const JwtStrategy = Strategy;
const GoogleStrategy = passportGoogle.Strategy;
export const configurePassport = (passport: passport.PassportStatic): passport.PassportStatic => {
  passport.use(new JwtStrategy(opts, (_: unknown, payload: any, done: VerifiedCallback) => {
    logger.silly(`payload = ${JSON.stringify(payload)}`);
    return (payload) ?
      done(null, {email: payload.email}) :
      done(null, false);
  }));
  passport.use('google', new GoogleStrategy(
      {
        clientID: environment.GOOGLE_CLIENT_ID,
        clientSecret: environment.GOOGLE_CLIENT_SECRET,
        callbackURL: environment.GOOGLE_CALLBACK_URL,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },
      async (
          _accessToken: string,
          _refreshToken: string,
          profile: passportGoogle.Profile,
          done: passportGoogle.VerifyCallback,
      ): Promise<void> => {
        const existingUser = await UserModel.findOne({email: profile.emails?.[0].value}).exec();
        if (existingUser?.emailVerified) {
          if (existingUser.googleId === profile.id) {
            done(null, existingUser);
            return;
          }
          existingUser.googleId = profile.id;
          existingUser.emailVerified = true;
          await existingUser.save();
          done(null, existingUser);
          return;
        }
        let displayNameSplit = profile.displayName.split(' ');
        if (displayNameSplit.length !== 2) {
          displayNameSplit = [profile.displayName, (profile.username) ? profile.username : '<lastName>'];
        }
        const newUser = await UserModel.create({
          email: profile.emails?.[0].value,
          googleId: profile.id,
          password: undefined,
          firstName: displayNameSplit[0],
          lastName: displayNameSplit[1],
          emailVerified: true,
        });
        done(null, newUser);
      },
  ));
  return passport;
};
