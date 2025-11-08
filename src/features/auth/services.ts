import User from './models/UserModel';
import bcrypt from 'bcryptjs';
import { UserAttributes, UserPublic, OTPVerificationResult, UserUpdateAttributes } from '../../types';
import { IUserService } from './interfaces';

class UserService implements IUserService {
  async createUser(userData: { name: string; email: string; password: string }): Promise<UserPublic> {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user.toJSON() as UserAttributes;
    return userWithoutPassword as UserPublic;
  }

  async createOAuthUser(userData: { name: string; email: string; googleId: string }): Promise<UserAttributes> {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: null, // OAuth users don't need a password
      googleId: userData.googleId,
    });

    return user.toJSON() as UserAttributes;
  }

  async findByGoogleId(googleId: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { googleId } });
    return user ? (user.toJSON() as UserAttributes) : null;
  }

  async findByEmail(email: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { email } });
    return user ? (user.toJSON() as UserAttributes) : null;
  }

  async findById(id: string): Promise<UserAttributes | null> {
    const user = await User.findByPk(id);
    return user ? (user.toJSON() as UserAttributes) : null;
  }

  async updateUser(id: string, updateData: UserUpdateAttributes): Promise<UserAttributes> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update(updateData);
    return user.toJSON() as UserAttributes;
  }

  async setResetToken(email: string, token: string, expiry: Date): Promise<UserAttributes> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({
      resetToken: token,
      resetTokenExpiry: expiry,
    });

    return user.toJSON() as UserAttributes;
  }

  async clearResetToken(id: string): Promise<UserAttributes> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({
      resetToken: null,
      resetTokenExpiry: null,
    });

    return user.toJSON() as UserAttributes;
  }

  async setOTP(email: string, otp: string, expiry: Date): Promise<UserAttributes> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({
      otp: otp,
      otpExpiry: expiry,
    });

    return user.toJSON() as UserAttributes;
  }

  async verifyOTP(email: string, otp: string): Promise<OTPVerificationResult> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return { valid: false, message: 'User not found' };
    }

    const userData = user.toJSON() as UserAttributes;

    if (!userData.otp) {
      return { valid: false, message: 'No OTP found. Please request a new one.' };
    }

    if (userData.otpExpiry && new Date() > new Date(userData.otpExpiry)) {
      return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (userData.otp !== otp) {
      return { valid: false, message: 'Invalid OTP. Please try again.' };
    }

    return { valid: true, userId: userData.id, user: userData };
  }

  async clearOTP(id: string): Promise<UserAttributes> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({
      otp: null,
      otpExpiry: null,
    });

    return user.toJSON() as UserAttributes;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default new UserService();

