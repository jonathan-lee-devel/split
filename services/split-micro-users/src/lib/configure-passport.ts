import passport from 'passport';
import {ExtractJwt, Strategy, VerifiedCallback} from 'passport-jwt';
import {environment} from '../environment';
import passportGoogle from 'passport-google-oauth20';
import {UserModel} from '../models/users/User';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: environment.JWT_SECRET,
};

const JwtStrategy = Strategy;
const GoogleStrategy = passportGoogle.Strategy;
export const configurePassport = (passport: passport.PassportStatic): passport.PassportStatic => {
  passport.use(new JwtStrategy(opts, (_, done: VerifiedCallback) => {
    const user = {};

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  }));
  passport.use('google', new GoogleStrategy(
      {
        clientID: environment.GOOGLE_CLIENT_ID,
        clientSecret: environment.GOOGLE_CLIENT_SECRET,
        callbackURL: environment.GOOGLE_CALLBACK_URL,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },
      async (
          accessToken: string,
          refreshToken: string,
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
        const newUser = await UserModel.create({
          email: profile.emails?.[0].value,
          googleId: profile.id,
          password: undefined,
          firstName: profile.displayName,
          lastName: undefined,
          emailVerified: true,
        });
        done(null, newUser);
      },
  ));
  return passport;
};
