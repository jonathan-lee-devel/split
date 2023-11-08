import passportGoogle from 'passport-google-oauth20';
import passport from 'passport';
import {environment} from '../environment';
import {User, UserModel} from '../models/users/User';
import {Strategy as LocalStrategy} from 'passport-local';
import {HydratedDocument} from 'mongoose';
import bcrypt from 'bcrypt';

const GoogleStrategy = passportGoogle.Strategy;
export const configurePassport = (): passport.PassportStatic => {
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
  passport.use('local', new LocalStrategy(async (username, password, done): Promise<void> => {
    try {
      const foundUser: HydratedDocument<User> | null = await UserModel.findOne({email: username}).exec();

      if (!foundUser) {
        return done(null, false, {message: 'Invalid username'});
      }

      if (!foundUser.password) {
        return done(null, false, {message: 'User is not registered via e-mail'});
      }

      if (!foundUser.emailVerified) {
        return done(null, false, {message: 'User\'s e-mail not verified'});
      }

      const validPassword = await bcrypt.compare(password, foundUser.password);
      if (!validPassword) {
        return done(null, false, {message: 'Invalid password'});
      }

      return done(null, foundUser);
    } catch (err) {
      if (err) return done(err);
    }
    return done(new Error('Unrecognized state'));
  }));
  // @ts-ignore
  passport.serializeUser((user: HydratedDocument<User>, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done): Promise<void> => {
    UserModel.findById(id).exec()
        .then((user) => {
          done(null, user);
        })
        .catch((reason) => {
          done(reason, null);
        });
  });
  return passport;
};
