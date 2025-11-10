import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { settings } from './settings';
import userService from '../features/auth/services';

if (settings.google.clientId && settings.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: settings.google.clientId,
        clientSecret: settings.google.clientSecret,
        callbackURL: settings.google.callbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { id, displayName, emails } = profile;
          const email = emails?.[0]?.value;

          if (!email) {
            console.error('Google OAuth: No email found in profile');
            return done(new Error('No email found in Google profile'), undefined);
          }

          let user = await userService.findByGoogleId(id);

          if (user) {
            return done(null, user);
          }

          const existingUser = await userService.findByEmail(email);

          if (existingUser) {
            await userService.updateUser(existingUser.id, { googleId: id });
            const updatedUser = await userService.findByGoogleId(id);
            return done(null, updatedUser);
          }

          const newUser = await userService.createOAuthUser({
            name: displayName || email.split('@')[0],
            email,
            googleId: id,
          });

          return done(null, newUser);
        } catch (error) {
          console.error('Google OAuth strategy error:', error);
          return done(error, undefined);
        }
      }
    )
  );
} else {
  console.warn('⚠️  Google OAuth credentials not configured. Google OAuth will be disabled.');
}

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { id: string }).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userService.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

