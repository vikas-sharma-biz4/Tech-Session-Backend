import { Router } from 'express';
import passport from 'passport';
import { validate } from '../../middlewares/validationMiddleware';
import { settings } from '../../config/settings';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordWithOTPSchema,
} from './validations';
import {
  signup,
  login,
  logout,
  forgotPassword,
  verifyOTP,
  verifySignupOTP,
  resetPasswordWithOTP,
  resetPassword,
  googleCallback,
} from './controllers';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/verify-signup-otp', validate(verifyOTPSchema), verifySignupOTP);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/reset-password-otp', validate(resetPasswordWithOTPSchema), resetPasswordWithOTP);
router.post('/reset-password', resetPassword);

if (settings.google.clientId && settings.google.clientSecret) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get(
    '/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${settings.frontend.url}/login?error=oauth_failed`,
    }),
    googleCallback
  );
} else {
  router.get('/google', (_req, res) => {
    res.status(503).json({
      message:
        'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.',
    });
  });
  router.get('/google/callback', (_req, res) => {
    res.status(503).json({
      message:
        'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.',
    });
  });
}

export default router;
