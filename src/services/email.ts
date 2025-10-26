import nodemailer from 'nodemailer';
import { logger } from './logger';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (email: string, fullName: string) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@promohive.com',
      to: email,
      subject: 'Welcome to PromoHive - Account Under Review',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to PromoHive</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Global Promo Network</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for registering with PromoHive! Your account has been created successfully.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #856404; margin: 0 0 10px 0;">⏳ Account Under Review</h3>
              <p style="color: #856404; margin: 0; line-height: 1.5;">
                Your account is currently under review by our admin team. You will receive an email notification once your account is approved and you can start earning!
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Once approved, you'll receive a $5 welcome bonus and can start completing tasks to earn money.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.PLATFORM_URL || 'http://localhost:3000'}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Visit PromoHive
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2024 PromoHive. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Global Promo Network</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
    throw error;
  }
};

export const sendApprovalEmail = async (email: string, fullName: string) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@promohive.com',
      to: email,
      subject: 'PromoHive Account Approved - Start Earning Now!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Account Approved!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Welcome to PromoHive</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Congratulations ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Great news! Your PromoHive account has been approved and you can now start earning money.
            </p>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #155724; margin: 0 0 10px 0;">💰 $5 Welcome Bonus Added!</h3>
              <p style="color: #155724; margin: 0; line-height: 1.5;">
                We've credited your account with a $5 welcome bonus. You can now start completing tasks and earning more money!
              </p>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin: 0 0 15px 0;">🚀 What's Next?</h3>
              <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Complete tasks to earn money</li>
                <li>Invite friends and earn referral bonuses</li>
                <li>Upgrade your level for higher earnings</li>
                <li>Withdraw your earnings via USDT</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.PLATFORM_URL || 'http://localhost:3000'}/login" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Login & Start Earning
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2024 PromoHive. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Global Promo Network</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Approval email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send approval email:', error);
    throw error;
  }
};

export const sendMagicLinkEmail = async (email: string, fullName: string, magicLink: string) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@promohive.com',
      to: email,
      subject: 'PromoHive Magic Link - Secure Login',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h1 style="margin: 0; font-size: 28px;">🔐 Secure Login</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">PromoHive Magic Link</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              You requested a magic link to log in to your PromoHive account. Click the button below to securely log in.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">
                Login to PromoHive
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #856404; margin: 0 0 10px 0;">⚠️ Important Security Note</h3>
              <p style="color: #856404; margin: 0; line-height: 1.5;">
                This magic link will expire in 10 minutes and can only be used once. If you didn't request this link, please ignore this email.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${magicLink}" style="color: #667eea; word-break: break-all;">${magicLink}</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2024 PromoHive. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Global Promo Network</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Magic link email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send magic link email:', error);
    throw error;
  }
};