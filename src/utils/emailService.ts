import nodemailer, { Transporter } from 'nodemailer';
import { settings } from '../config/settings';
import { EmailResult } from '../types';

const transporter: Transporter = nodemailer.createTransport({
  host: settings.email.host,
  port: settings.email.port,
  secure: settings.email.secure,
  auth: settings.email.auth,
});

transporter.verify((error: Error | null) => {
  if (error) {
    console.log('Email configuration error:', error);
    console.log('⚠️  Email service is not properly configured. Please check your .env file.');
  } else {
    console.log('✅ Email service is ready to send emails');
  }
});

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (
  email: string,
  otp: string,
  name: string = 'User'
): Promise<EmailResult> => {
  try {
    const mailOptions = {
      from: `"${settings.email.from.name}" <${settings.email.from.address}>`,
      to: email,
      subject: '📚 Password Reset - Book Marketplace Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Comic Sans MS', 'Trebuchet MS', Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              background: linear-gradient(135deg, #87CEEB 0%, #98D8C8 100%);
              padding: 40px 20px;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
              border: 4px solid #E63946;
            }
            .header-gradient {
              background: linear-gradient(135deg, #E63946 0%, #FF6B6B 100%);
              padding: 50px 30px;
              text-align: center;
              color: #ffffff;
              position: relative;
              border-bottom: 5px solid #C1121F;
            }
            .header-gradient h1 {
              font-size: 36px;
              font-weight: 900;
              margin-bottom: 10px;
              text-shadow: 3px 3px 0px #C1121F, 6px 6px 0px rgba(0, 0, 0, 0.3);
              letter-spacing: 2px;
            }
            .header-gradient .subtitle {
              font-size: 18px;
              opacity: 0.95;
              font-weight: 600;
              text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
            }
            .content {
              padding: 40px 30px;
              background: linear-gradient(180deg, #FFF9F0 0%, #FFFFFF 100%);
            }
            .security-icon {
              text-align: center;
              font-size: 80px;
              margin-bottom: 20px;
              animation: bounce 2s infinite;
            }
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-15px); }
              60% { transform: translateY(-8px); }
            }
            .greeting {
              font-size: 22px;
              color: #2D5016;
              margin-bottom: 25px;
              text-align: center;
              font-weight: 700;
            }
            .greeting strong {
              color: #E63946;
              font-size: 24px;
              text-shadow: 2px 2px 0px #FFD700;
            }
            .message {
              font-size: 17px;
              color: #2D5016;
              text-align: center;
              margin-bottom: 35px;
              line-height: 1.8;
              font-weight: 500;
            }
            .otp-container {
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              border-radius: 20px;
              padding: 30px;
              margin: 35px 0;
              text-align: center;
              border: 4px solid #FF6B35;
              box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
            }
            .otp-label {
              font-size: 16px;
              color: #2D5016;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 15px;
              font-weight: 800;
            }
            .otp-box {
              background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
              color: #FFD700;
              font-size: 48px;
              font-weight: 900;
              text-align: center;
              padding: 30px 50px;
              border-radius: 20px;
              letter-spacing: 15px;
              margin: 15px auto;
              display: inline-block;
              box-shadow: 0 10px 25px rgba(230, 57, 70, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.3);
              text-shadow: 3px 3px 0px #C1121F, 6px 6px 0px rgba(0, 0, 0, 0.3);
              font-family: 'Courier New', monospace;
              border: 4px solid #FFD700;
            }
            .info-box {
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              border: 4px solid #FF6B35;
              padding: 20px;
              margin: 30px 0;
              border-radius: 15px;
              box-shadow: 0 6px 15px rgba(255, 107, 53, 0.3);
            }
            .info-box strong {
              color: #C1121F;
              font-size: 18px;
              display: flex;
              align-items: center;
              gap: 8px;
              font-weight: 800;
            }
            .info-box p {
              margin-top: 8px;
              color: #2D5016;
              font-size: 16px;
              font-weight: 600;
            }
            .security-section {
              background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
              border-radius: 15px;
              padding: 25px;
              margin: 30px 0;
              border: 4px solid #2D5016;
              box-shadow: 0 6px 15px rgba(45, 80, 22, 0.3);
            }
            .security-section h3 {
              color: #FFD700;
              font-size: 20px;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              gap: 10px;
              font-weight: 800;
              text-shadow: 2px 2px 0px #2D5016;
            }
            .security-list {
              list-style: none;
              padding: 0;
            }
            .security-list li {
              padding: 12px 0;
              padding-left: 35px;
              position: relative;
              color: #FFF9F0;
              font-size: 16px;
              font-weight: 600;
            }
            .security-list li:before {
              content: "📚";
              position: absolute;
              left: 0;
              font-size: 20px;
            }
            .divider {
              height: 4px;
              background: linear-gradient(to right, transparent, #FFD700, #E63946, #FFD700, transparent);
              margin: 35px 0;
              border-radius: 2px;
            }
            .footer {
              background: linear-gradient(135deg, #2D5016 0%, #1A3009 100%);
              padding: 30px;
              text-align: center;
              border-top: 5px solid #FFD700;
            }
            .footer p {
              color: #FFD700;
              font-size: 14px;
              margin: 5px 0;
              font-weight: 600;
            }
            .footer .brand {
              color: #4ECDC4;
              font-weight: 800;
              font-size: 16px;
              text-shadow: 2px 2px 0px #2D5016;
            }
            .cta-note {
              text-align: center;
              color: #2D5016;
              font-size: 16px;
              font-weight: 700;
              margin-top: 20px;
              font-style: normal;
            }
            @media only screen and (max-width: 600px) {
              .header-gradient {
                padding: 40px 20px;
              }
              .header-gradient h1 {
                font-size: 26px;
              }
              .content {
                padding: 30px 20px;
              }
              .otp-box {
                font-size: 32px;
                letter-spacing: 8px;
                padding: 20px 30px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header-gradient">
              <div class="security-icon">📚</div>
              <h1>PASSWORD RESET REQUEST</h1>
              <p class="subtitle">Book Marketplace Verification Code 📖</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Hello <strong>${name}</strong>! 👋
              </div>
              
              <p class="message">
                📚 You've requested to reset your password for your Book Marketplace account! Use the verification code below to reset your password and continue managing your book listings!
              </p>
              
              <div class="otp-container">
                <div class="otp-label">📚 YOUR VERIFICATION CODE 📚</div>
                <div class="otp-box">${otp}</div>
              </div>
              
              <div class="info-box">
                <strong>⏰ TIME LIMIT!</strong>
                <p>This code expires in <strong>10 minutes</strong>! Use it quickly to reset your password! ⚡</p>
              </div>
              
              <div class="security-section">
                <h3>🛡️ SECURITY TIPS</h3>
                <ul class="security-list">
                  <li>Keep this code secret and never share it with anyone! 🔒</li>
                  <li>We'll never ask for your code via email or phone - beware of scams! ⚠️</li>
                  <li>Didn't request this? Please secure your account immediately! 🚨</li>
                </ul>
              </div>
              
              <div class="divider"></div>
              
              <p class="cta-note">
                📖 Enter the code above to reset your password and continue managing your book listings!
              </p>
            </div>
            
            <div class="footer">
              <p>This is an automated email from <span class="brand">${settings.email.from.name}</span></p>
              <p>Please do not reply to this message</p>
              <p style="margin-top: 15px; color: #FFD700;">&copy; ${new Date().getFullYear()} ${settings.email.from.name}. All rights reserved. 🎮</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${name},
        
        You have requested to reset your password for your Book Marketplace account. Please use the following One-Time Password (OTP) to verify your identity:
        
        OTP: ${otp}
        
        This OTP is valid for 10 minutes only.
        
        If you didn't request this password reset, please ignore this email and consider securing your account.
        
        Best regards,
        Book Marketplace Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const sendSignupOTPEmail = async (
  email: string,
  otp: string,
  name: string
): Promise<EmailResult> => {
  try {
    const mailOptions = {
      from: `"${settings.email.from.name}" <${settings.email.from.address}>`,
      to: email,
      subject: '📚 Welcome to Book Marketplace! Verify Your Email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Comic Sans MS', 'Trebuchet MS', Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
              padding: 40px 20px;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
              border: 4px solid #4ECDC4;
            }
            .header-gradient {
              background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
              padding: 50px 30px;
              text-align: center;
              color: #ffffff;
              position: relative;
              border-bottom: 5px solid #2D5016;
            }
            .header-gradient h1 {
              font-size: 36px;
              font-weight: 900;
              margin-bottom: 10px;
              text-shadow: 3px 3px 0px #2D5016, 6px 6px 0px rgba(0, 0, 0, 0.3);
              letter-spacing: 2px;
            }
            .header-gradient .subtitle {
              font-size: 18px;
              opacity: 0.95;
              font-weight: 600;
              text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
            }
            .content {
              padding: 40px 30px;
              background: linear-gradient(180deg, #FFF9F0 0%, #FFFFFF 100%);
            }
            .welcome-icon {
              text-align: center;
              font-size: 80px;
              margin-bottom: 20px;
              animation: bounce 2s infinite;
            }
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-15px); }
              60% { transform: translateY(-8px); }
            }
            .greeting {
              font-size: 22px;
              color: #2D5016;
              margin-bottom: 25px;
              text-align: center;
              font-weight: 700;
            }
            .greeting strong {
              color: #4ECDC4;
              font-size: 24px;
              text-shadow: 2px 2px 0px #FFD700;
            }
            .message {
              font-size: 17px;
              color: #2D5016;
              text-align: center;
              margin-bottom: 35px;
              line-height: 1.8;
              font-weight: 500;
            }
            .otp-container {
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              border-radius: 20px;
              padding: 30px;
              margin: 35px 0;
              text-align: center;
              border: 4px solid #FF6B35;
              box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
            }
            .otp-label {
              font-size: 16px;
              color: #2D5016;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 15px;
              font-weight: 800;
            }
            .otp-box {
              background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
              color: #FFD700;
              font-size: 48px;
              font-weight: 900;
              text-align: center;
              padding: 30px 50px;
              border-radius: 20px;
              letter-spacing: 15px;
              margin: 15px auto;
              display: inline-block;
              box-shadow: 0 10px 25px rgba(78, 205, 196, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.3);
              text-shadow: 3px 3px 0px #2D5016, 6px 6px 0px rgba(0, 0, 0, 0.3);
              font-family: 'Courier New', monospace;
              border: 4px solid #FFD700;
            }
            .info-box {
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              border: 4px solid #FF6B35;
              padding: 20px;
              margin: 30px 0;
              border-radius: 15px;
              box-shadow: 0 6px 15px rgba(255, 107, 53, 0.3);
            }
            .info-box strong {
              color: #C1121F;
              font-size: 18px;
              display: flex;
              align-items: center;
              gap: 8px;
              font-weight: 800;
            }
            .info-box p {
              margin-top: 8px;
              color: #2D5016;
              font-size: 16px;
              font-weight: 600;
            }
            .security-section {
              background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
              border-radius: 15px;
              padding: 25px;
              margin: 30px 0;
              border: 4px solid #FFD700;
              box-shadow: 0 6px 15px rgba(230, 57, 70, 0.3);
            }
            .security-section h3 {
              color: #FFD700;
              font-size: 20px;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              gap: 10px;
              font-weight: 800;
              text-shadow: 2px 2px 0px #C1121F;
            }
            .security-list {
              list-style: none;
              padding: 0;
            }
            .security-list li {
              padding: 12px 0;
              padding-left: 35px;
              position: relative;
              color: #FFF9F0;
              font-size: 16px;
              font-weight: 600;
            }
            .security-list li:before {
              content: "⭐";
              position: absolute;
              left: 0;
              font-size: 20px;
            }
            .divider {
              height: 4px;
              background: linear-gradient(to right, transparent, #FFD700, #4ECDC4, #FFD700, transparent);
              margin: 35px 0;
              border-radius: 2px;
            }
            .footer {
              background: linear-gradient(135deg, #2D5016 0%, #1A3009 100%);
              padding: 30px;
              text-align: center;
              border-top: 5px solid #FFD700;
            }
            .footer p {
              color: #FFD700;
              font-size: 14px;
              margin: 5px 0;
              font-weight: 600;
            }
            .footer .brand {
              color: #4ECDC4;
              font-weight: 800;
              font-size: 16px;
              text-shadow: 2px 2px 0px #2D5016;
            }
            .cta-note {
              text-align: center;
              color: #2D5016;
              font-size: 16px;
              font-weight: 700;
              margin-top: 20px;
              font-style: normal;
            }
            @media only screen and (max-width: 600px) {
              .header-gradient {
                padding: 40px 20px;
              }
              .header-gradient h1 {
                font-size: 26px;
              }
              .content {
                padding: 30px 20px;
              }
              .otp-box {
                font-size: 32px;
                letter-spacing: 8px;
                padding: 20px 30px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header-gradient">
              <div class="welcome-icon">📚</div>
              <h1>WELCOME TO BOOK MARKETPLACE!</h1>
              <p class="subtitle">Start Selling & Buying Books Today! 📖</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Hello <strong>${name}</strong>! 👋
              </div>
              
              <p class="message">
                📚 Welcome to Book Marketplace! We're excited to have you join our community of book lovers, sellers, and readers. To get started, please verify your email address using the code below!
              </p>
              
              <div class="otp-container">
                <div class="otp-label">📚 YOUR VERIFICATION CODE 📚</div>
                <div class="otp-box">${otp}</div>
              </div>
              
              <div class="info-box">
                <strong>⏰ TIME LIMIT!</strong>
                <p>This code expires in <strong>10 minutes</strong>! Use it quickly to activate your account! ⚡</p>
              </div>
              
              <div class="security-section">
                <h3>🛡️ SECURITY TIPS</h3>
                <ul class="security-list">
                  <li>Keep this code secret and never share it with anyone! 🔒</li>
                  <li>We'll never ask for your code via email or phone - beware of scams! ⚠️</li>
                  <li>Didn't create this account? You can safely ignore this email! 🚫</li>
                </ul>
              </div>
              
              <div class="divider"></div>
              
              <p class="cta-note">
                📖 Enter the code above to verify your email and start listing or browsing books!
              </p>
            </div>
            
            <div class="footer">
              <p>This is an automated email from <span class="brand">${settings.email.from.name}</span></p>
              <p>Please do not reply to this message</p>
              <p style="margin-top: 15px; color: #FFD700;">&copy; ${new Date().getFullYear()} ${settings.email.from.name}. All rights reserved. 🎮</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Book Marketplace!
        
        Hello ${name},
        
        Thank you for signing up for Book Marketplace! To complete your registration, please verify your email address using the One-Time Password (OTP) below:
        
        OTP: ${otp}
        
        This OTP is valid for 10 minutes only.
        
        Once verified, you'll be able to:
        - List your books for sale
        - Browse and search our book collection
        - Connect with other book lovers
        
        If you didn't create an account with us, please ignore this email.
        
        Best regards,
        Book Marketplace Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Error sending signup OTP email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<EmailResult> => {
  try {
    const mailOptions = {
      from: `"${settings.email.from.name}" <${settings.email.from.address}>`,
      to: email,
      subject: '📚 Welcome to Book Marketplace! Your Account is Ready',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Comic Sans MS', 'Trebuchet MS', Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              padding: 40px 20px;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
              border: 4px solid #FFD700;
            }
            .header-gradient {
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              padding: 50px 30px;
              text-align: center;
              color: #2D5016;
              position: relative;
              border-bottom: 5px solid #FF6B35;
            }
            .header-gradient h1 {
              font-size: 36px;
              font-weight: 900;
              margin-bottom: 10px;
              text-shadow: 3px 3px 0px #FF6B35, 6px 6px 0px rgba(0, 0, 0, 0.3);
              letter-spacing: 2px;
            }
            .header-gradient .subtitle {
              font-size: 18px;
              opacity: 0.95;
              font-weight: 600;
              text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
            }
            .content {
              padding: 40px 30px;
              background: linear-gradient(180deg, #FFF9F0 0%, #FFFFFF 100%);
            }
            .success-icon {
              text-align: center;
              font-size: 80px;
              margin-bottom: 20px;
              animation: scaleIn 0.5s ease-out;
            }
            @keyframes scaleIn {
              0% { transform: scale(0) rotate(0deg); }
              50% { transform: scale(1.2) rotate(180deg); }
              100% { transform: scale(1) rotate(360deg); }
            }
            .greeting {
              font-size: 26px;
              color: #2D5016;
              margin-bottom: 25px;
              text-align: center;
              font-weight: 800;
            }
            .greeting strong {
              color: #E63946;
              font-size: 28px;
              text-shadow: 2px 2px 0px #FFD700;
            }
            .message {
              font-size: 18px;
              color: #2D5016;
              text-align: center;
              margin-bottom: 30px;
              line-height: 1.8;
              font-weight: 600;
            }
            .success-badge {
              background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
              color: #FFD700;
              padding: 20px 40px;
              border-radius: 50px;
              display: inline-block;
              font-weight: 900;
              font-size: 18px;
              margin: 20px auto;
              text-align: center;
              box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
              border: 4px solid #FFD700;
              text-shadow: 2px 2px 0px #2D5016;
            }
            .features-section {
              background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
              border-radius: 20px;
              padding: 30px;
              margin: 35px 0;
              border: 4px solid #2D5016;
              box-shadow: 0 8px 20px rgba(45, 80, 22, 0.3);
            }
            .features-section h3 {
              color: #FFD700;
              font-size: 24px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 900;
              text-shadow: 2px 2px 0px #2D5016;
            }
            .features-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 20px;
              margin-top: 20px;
            }
            .feature-item {
              text-align: center;
              padding: 25px;
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              border-radius: 15px;
              box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
              border: 3px solid #FF6B35;
            }
            .feature-icon {
              font-size: 40px;
              margin-bottom: 12px;
            }
            .feature-text {
              font-size: 16px;
              color: #2D5016;
              font-weight: 800;
            }
            .cta-section {
              background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
              border-radius: 20px;
              padding: 25px;
              margin: 30px 0;
              text-align: center;
              box-shadow: 0 6px 20px rgba(230, 57, 70, 0.4);
              border: 4px solid #FFD700;
            }
            .cta-section h3 {
              color: #FFD700;
              font-size: 22px;
              margin-bottom: 10px;
              font-weight: 900;
              text-shadow: 2px 2px 0px #C1121F;
            }
            .cta-section p {
              color: #FFF9F0;
              font-size: 16px;
              margin: 0;
              font-weight: 600;
            }
            .divider {
              height: 4px;
              background: linear-gradient(to right, transparent, #FFD700, #E63946, #4ECDC4, #FFD700, transparent);
              margin: 35px 0;
              border-radius: 2px;
            }
            .footer {
              background: linear-gradient(135deg, #2D5016 0%, #1A3009 100%);
              padding: 30px;
              text-align: center;
              border-top: 5px solid #FFD700;
            }
            .footer p {
              color: #FFD700;
              font-size: 14px;
              margin: 5px 0;
              font-weight: 600;
            }
            .footer .brand {
              color: #4ECDC4;
              font-weight: 800;
              font-size: 16px;
              text-shadow: 2px 2px 0px #2D5016;
            }
            .cta-note {
              text-align: center;
              color: #2D5016;
              font-size: 18px;
              font-weight: 800;
              margin-top: 20px;
              font-style: normal;
            }
            @media only screen and (max-width: 600px) {
              .header-gradient {
                padding: 40px 20px;
              }
              .header-gradient h1 {
                font-size: 26px;
              }
              .content {
                padding: 30px 20px;
              }
              .features-grid {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header-gradient">
              <div class="success-icon">📚</div>
              <h1>ACCOUNT ACTIVATED!</h1>
              <p class="subtitle">Welcome to Book Marketplace! 📖</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Hello <strong>${name}</strong>! 👋
              </div>
              
              <p class="message">
                🎉 Congratulations! Your email has been verified and your account is now fully activated! 
                You're all set to start selling or buying books on our marketplace!
              </p>
              
              <div style="text-align: center;">
                <div class="success-badge">
                  📚 ACCOUNT VERIFIED! 📚
                </div>
              </div>
              
              <div class="features-section">
                <h3>🚀 WHAT YOU CAN DO NOW!</h3>
                <div class="features-grid">
                  <div class="feature-item">
                    <div class="feature-icon">📖</div>
                    <div class="feature-text">Browse Books</div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <div class="feature-text">Sell Books</div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">🔍</div>
                    <div class="feature-text">Search & Filter</div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">💬</div>
                    <div class="feature-text">24/7 Support</div>
                  </div>
                </div>
              </div>
              
              <div class="cta-section">
                <h3>💡 GET STARTED!</h3>
                <p>Start listing your books or browse our collection of amazing reads! 📚</p>
              </div>
              
              <div class="divider"></div>
              
              <p class="cta-note">
                📖 We're thrilled to have you! Start exploring our book marketplace and discover your next great read!
              </p>
            </div>
            
            <div class="footer">
              <p>This is an automated email from <span class="brand">${settings.email.from.name}</span></p>
              <p>Please do not reply to this message</p>
              <p style="margin-top: 15px; color: #FFD700;">&copy; ${new Date().getFullYear()} ${settings.email.from.name}. All rights reserved. 🎮</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Book Marketplace!
        
        Hello ${name},
        
        Congratulations! Your email has been verified and your account is now fully activated.
        You're all set to start selling or buying books on our marketplace!
        
        Your account is now active and ready to use. You can:
        - List your books for sale
        - Browse and search our extensive book collection
        - Filter books by type, condition, price, and more
        - Connect with other book lovers
        
        If you have any questions or need assistance, our support team is here to help you every step of the way.
        
        We're thrilled to have you as part of our book marketplace community!
        
        Happy reading and selling!
        
        Best regards,
        Book Marketplace Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
    };
  }
};
