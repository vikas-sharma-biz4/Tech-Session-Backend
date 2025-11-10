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

export const sendOTPEmail = async (email: string, otp: string, name: string = 'User'): Promise<EmailResult> => {
  try {
    const mailOptions = {
      from: `"${settings.email.from.name}" <${settings.email.from.address}>`,
      to: email,
      subject: '🍄 Password Reset - Your Super Code!',
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
              content: "🍄";
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
              <div class="security-icon">🍄</div>
              <h1>SUPER PASSWORD RESET!</h1>
              <p class="subtitle">Your Power-Up Code is Ready! 🎮</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Hello <strong>${name}</strong>! 👋
              </div>
              
              <p class="message">
                🎯 You've requested to reset your password! Use the SUPER CODE below to unlock your account and continue your adventure!
              </p>
              
              <div class="otp-container">
                <div class="otp-label">⭐ YOUR SUPER CODE ⭐</div>
                <div class="otp-box">${otp}</div>
              </div>
              
              <div class="info-box">
                <strong>⏰ TIME LIMIT!</strong>
                <p>This code expires in <strong>10 minutes</strong>! Use it quickly before it disappears! ⚡</p>
              </div>
              
              <div class="security-section">
                <h3>🛡️ POWER-UP TIPS</h3>
                <ul class="security-list">
                  <li>Keep this code secret - like a hidden coin! 🪙</li>
                  <li>We'll never ask for your code - beware of imposters! 👹</li>
                  <li>Didn't request this? Secure your account immediately! 🔒</li>
                </ul>
              </div>
              
              <div class="divider"></div>
              
              <p class="cta-note">
                🎮 Enter the code above to reset your password and continue your journey!
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
        
        You have requested to reset your password. Please use the following One-Time Password (OTP) to verify your identity:
        
        OTP: ${otp}
        
        This OTP is valid for 10 minutes only.
        
        If you didn't request this password reset, please ignore this email.
        
        Best regards,
        ${settings.email.from.name}
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

export const sendSignupOTPEmail = async (email: string, otp: string, name: string): Promise<EmailResult> => {
  try {
    const mailOptions = {
      from: `"${settings.email.from.name}" <${settings.email.from.address}>`,
      to: email,
      subject: '⭐ Welcome to the Adventure! Verify Your Email 🎮',
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
              <div class="welcome-icon">⭐</div>
              <h1>WELCOME TO ${settings.email.from.name.toUpperCase()}!</h1>
              <p class="subtitle">Your Adventure Begins Now! 🎮</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Hello <strong>${name}</strong>! 👋
              </div>
              
              <p class="message">
                🎉 Welcome to the team! To start your epic journey, verify your email address using the SUPER CODE below!
              </p>
              
              <div class="otp-container">
                <div class="otp-label">⭐ YOUR VERIFICATION CODE ⭐</div>
                <div class="otp-box">${otp}</div>
              </div>
              
              <div class="info-box">
                <strong>⏰ TIME LIMIT!</strong>
                <p>This code expires in <strong>10 minutes</strong>! Use it quickly to unlock your account! ⚡</p>
              </div>
              
              <div class="security-section">
                <h3>🛡️ POWER-UP TIPS</h3>
                <ul class="security-list">
                  <li>Keep this code secret - like a hidden coin! 🪙</li>
                  <li>We'll never ask for your code - beware of imposters! 👹</li>
                  <li>Didn't create this account? You can safely ignore this email! 🚫</li>
                </ul>
              </div>
              
              <div class="divider"></div>
              
              <p class="cta-note">
                🎮 Enter the code above to verify your email and begin your amazing adventure!
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
        Welcome to ${settings.email.from.name}!
        
        Hello ${name},
        
        Thank you for signing up! To complete your registration, please verify your email address using the One-Time Password (OTP) below:
        
        OTP: ${otp}
        
        This OTP is valid for 10 minutes only.
        
        If you didn't create an account with us, please ignore this email.
        
        Best regards,
        ${settings.email.from.name}
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
      subject: '🎊 LEVEL UP! Your Account is Ready! 🎮',
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
              <div class="success-icon">🎊</div>
              <h1>LEVEL UP! 🎮</h1>
              <p class="subtitle">Your Account is Now Active! ⭐</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Hello <strong>${name}</strong>! 👋
              </div>
              
              <p class="message">
                🎉 Congratulations! Your email has been verified and your account is now fully activated! 
                You're all set to start your epic adventure!
              </p>
              
              <div style="text-align: center;">
                <div class="success-badge">
                  ⭐ ACCOUNT VERIFIED! ⭐
                </div>
              </div>
              
              <div class="features-section">
                <h3>🚀 POWER-UPS UNLOCKED!</h3>
                <div class="features-grid">
                  <div class="feature-item">
                    <div class="feature-icon">🛡️</div>
                    <div class="feature-text">Secure Account</div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <div class="feature-text">Fast Access</div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-text">Full Features</div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">💬</div>
                    <div class="feature-text">24/7 Support</div>
                  </div>
                </div>
              </div>
              
              <div class="cta-section">
                <h3>💡 NEED HELP?</h3>
                <p>Our support team is here to help you every step of your journey! 🎮</p>
              </div>
              
              <div class="divider"></div>
              
              <p class="cta-note">
                🎮 We're thrilled to have you! Start exploring and make the most of your adventure!
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
        Welcome to ${settings.email.from.name}!
        
        Hello ${name},
        
        Congratulations! Your email has been verified and your account is now fully activated.
        You're all set to explore everything we have to offer.
        
        Your account is now active and ready to use. You can access all features and start your journey with us.
        
        If you have any questions or need assistance, our support team is here to help you every step of the way.
        
        We're thrilled to have you as part of our community!
        
        Best regards,
        ${settings.email.from.name}
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
