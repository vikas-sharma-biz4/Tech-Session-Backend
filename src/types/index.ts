export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  otp: string | null;
  otpExpiry: Date | null;
  googleId: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
}

export interface UserUpdateAttributes {
  name?: string;
  email?: string;
  password?: string;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  otp?: string | null;
  otpExpiry?: Date | null;
  googleId?: string | null;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface OTPVerificationResult {
  valid: boolean;
  message?: string;
  userId?: string;
  user?: UserAttributes;
}

export interface JWTPayload {
  userId: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: UserPublic;
}

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

