import { Request } from 'express';
import { UserAttributes } from '../types';

export interface AuthRequest extends Request {
  user?: UserAttributes;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordWithOTPRequest {
  email: string;
  otp: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

