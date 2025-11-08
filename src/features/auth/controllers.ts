import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { settings } from '../../config/settings';
import userService from './services';
import {
  generateOTP,
  sendOTPEmail,
  sendSignupOTPEmail,
  sendWelcomeEmail,
} from '../../utils/emailService';
import {
  AuthRequest,
  SignupRequest,
  LoginRequest,
  ForgotPasswordRequest,
  VerifyOTPRequest,
  ResetPasswordWithOTPRequest,
} from '../../interfaces/auth.interface';
import { UserPublic, AuthResponse, ApiResponse } from '../../types';
import { OTP_EXPIRY_MS, BCRYPT_SALT_ROUNDS } from '../../utils/constants';

export const signup = async (
  req: AuthRequest,
  res: Response<AuthResponse | ApiResponse>
): Promise<void> => {
  try {
    const { name, email, password } = req.body as SignupRequest;

    const existingUser = await userService.findByEmail(email);

    if (existingUser) {
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);

      await userService.setOTP(email, otp, otpExpiry);
      const emailResult = await sendSignupOTPEmail(email, otp, existingUser.name);

      if (!emailResult.success) {
        console.error('Failed to send signup OTP email:', emailResult.error);
        res
          .status(500)
          .json({ message: 'Failed to send verification email. Please try again later.' });
        return;
      }

      res.json({
        message: 'Verification OTP sent to your email address.',
        success: true,
      });
      return;
    }

    const user = await userService.createUser({ name, email, password });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);

    await userService.setOTP(email, otp, otpExpiry);
    const emailResult = await sendSignupOTPEmail(email, otp, user.name);

    if (!emailResult.success) {
      console.error('Failed to send signup OTP email:', emailResult.error);
      res
        .status(500)
        .json({ message: 'Failed to send verification email. Please try again later.' });
      return;
    }

    res.status(201).json({
      message: 'Account created. Please check your email for verification OTP.',
      success: true,
    });
  } catch (error) {
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(400).json({ message });
  }
};

export const login = async (
  req: AuthRequest,
  res: Response<AuthResponse | ApiResponse>
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;
    const user = await userService.findByEmail(email);

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await userService.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, settings.jwt.secret, {
      expiresIn: settings.jwt.expiresIn,
    });

    const userPublic: UserPublic = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    res.json({
      message: 'Login successful',
      token,
      user: userPublic,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { email } = req.body as ForgotPasswordRequest;
    const user = await userService.findByEmail(email);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);

    await userService.setOTP(email, otp, otpExpiry);
    const emailResult = await sendOTPEmail(email, otp, user.name);

    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      res.status(500).json({ message: 'Failed to send OTP email. Please try again later.' });
      return;
    }

    res.json({
      message: 'OTP sent to your email address',
      success: true,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOTP = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { email, otp } = req.body as VerifyOTPRequest;
    const result = await userService.verifyOTP(email, otp);

    if (!result.valid) {
      res.status(400).json({ message: result.message || 'OTP verification failed' });
      return;
    }

    res.json({
      message: 'OTP verified successfully',
      data: { verified: true },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifySignupOTP = async (
  req: AuthRequest,
  res: Response<AuthResponse | ApiResponse>
): Promise<void> => {
  try {
    const { email, otp } = req.body as VerifyOTPRequest;
    const result = await userService.verifyOTP(email, otp);

    if (!result.valid || !result.userId) {
      res.status(400).json({ message: result.message || 'OTP verification failed' });
      return;
    }

    await userService.clearOTP(result.userId);

    const user = await userService.findById(result.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, settings.jwt.secret, {
      expiresIn: settings.jwt.expiresIn,
    });

    sendWelcomeEmail(user.email, user.name).catch((error: Error) => {
      console.error('Failed to send welcome email:', error);
    });

    const userPublic: UserPublic = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    res.json({
      message: 'Account verified successfully',
      token,
      user: userPublic,
    });
  } catch (error) {
    console.error('Verify signup OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPasswordWithOTP = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { email, otp, password } = req.body as ResetPasswordWithOTPRequest;
    const result = await userService.verifyOTP(email, otp);

    if (!result.valid || !result.userId) {
      res.status(400).json({ message: result.message || 'OTP verification failed' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    await userService.updateUser(result.userId, { password: hashedPassword });
    await userService.clearOTP(result.userId);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password with OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (
  _req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    res.status(400).json({ message: 'Legacy route not supported. Please use OTP-based reset.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const googleAuth = async (_req: AuthRequest, _res: Response): Promise<void> => {
  // This will be handled by passport middleware
};

export const googleCallback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user as UserAttributes | undefined;

    if (!user) {
      res.redirect(`${settings.frontend.url}/login?error=oauth_failed`);
      return;
    }

    const token = jwt.sign({ userId: user.id }, settings.jwt.secret, {
      expiresIn: settings.jwt.expiresIn,
    });

    const userPublic: UserPublic = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    sendWelcomeEmail(user.email, user.name).catch((error: Error) => {
      console.error('Failed to send welcome email for Google OAuth user:', error);
    });

    res.redirect(
      `${settings.frontend.url}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userPublic))}`
    );
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${settings.frontend.url}/login?error=oauth_failed`);
  }
};
