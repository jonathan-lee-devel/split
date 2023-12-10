import passport from 'passport';
import {ExtractJwt, Strategy, VerifiedCallback} from 'passport-jwt';
import passportGoogle from 'passport-google-oauth20';
import {UserModel} from './models';

const JwtStrategy = Strategy;
const GoogleStrategy = passportGoogle.Strategy;

export const configurePassport = async (
    passport: passport.PassportStatic,
    googleClientId: string,
    googleClientSecret: string,
    googleCallbackUrl: string,
    jwtSecret: string,
): Promise<passport.PassportStatic> => {
  return configurePassportGoogleStrategy(
      configurePassportJwtStrategy(passport, jwtSecret),
      googleClientId,
      googleClientSecret,
      googleCallbackUrl,
  );
};

const configurePassportJwtStrategy = (
    passport: passport.PassportStatic,
    jwtSecret: string,
) => {
  passport.use(new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret,
        passReqToCallback: true,
      }, (_: unknown, payload: any, done: VerifiedCallback) => {
        return (payload) ?
        done(null, {email: payload.email, firstName: payload.firstName, lastName: payload.lastName, emailVerified: payload.emailVerified}) :
        done(null, false);
      }));
  return passport;
};

const configurePassportGoogleStrategy = (
    passport: passport.PassportStatic,
    googleClientId: string,
    googleClientSecret: string,
    googleCallbackUrl: string,
) => {
  passport.use('google', new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackUrl,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },
      async (
          _accessToken: string,
          _refreshToken: string,
          profile: passportGoogle.Profile,
          done: passportGoogle.VerifyCallback,
      ) => {
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
