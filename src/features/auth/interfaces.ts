import {
  UserAttributes,
  UserPublic,
  OTPVerificationResult,
  UserUpdateAttributes,
} from '../../types';

export interface IUserService {
  createUser(userData: { name: string; email: string; password: string }): Promise<UserPublic>;
  createOAuthUser(userData: {
    name: string;
    email: string;
    googleId: string;
  }): Promise<UserAttributes>;
  findByEmail(email: string): Promise<UserAttributes | null>;
  findByGoogleId(googleId: string): Promise<UserAttributes | null>;
  findById(id: string): Promise<UserAttributes | null>;
  updateUser(id: string, updateData: UserUpdateAttributes): Promise<UserAttributes>;
  setResetToken(email: string, token: string, expiry: Date): Promise<UserAttributes>;
  clearResetToken(id: string): Promise<UserAttributes>;
  setOTP(email: string, otp: string, expiry: Date): Promise<UserAttributes>;
  verifyOTP(email: string, otp: string): Promise<OTPVerificationResult>;
  clearOTP(id: string): Promise<UserAttributes>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
