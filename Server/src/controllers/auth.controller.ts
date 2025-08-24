import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { User } from '../models/user.model';
import { AppError } from '../middleware/errorHandler';

const signToken = (id: string, role: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '1d'
  });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new AppError('Username already exists', 400));
    }

    const user = await User.create({
      username,
      password,
      role: 'user',
    });

    createSendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect username or password', 401));
    }

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// Forgot Password Handler
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  await user.save();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `https://mywebsite.com/reset-password?token=${token}`;
  const mailOptions = {
    from: `"Planera" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset.</p>
           <p><a href="${resetUrl}">Click here to reset your password</a></p>
           <p>This link will expire in 1 hour.</p>`,
  };

  await transporter.sendMail(mailOptions);
  res.json({ message: 'Password reset email sent' });
};

// Reset Password Handler
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ message: 'Password has been reset' });
};