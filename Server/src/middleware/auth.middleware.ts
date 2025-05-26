import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AppError } from './errorHandler';

interface JwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // 1) Get token from cookies or Authorization header
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log('Token found in cookies');
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    }

    // Debug logging
    console.log('Auth middleware - Headers:', {
      authorization: req.headers.authorization ? 'Present' : 'Missing',
      origin: req.headers.origin,
      'user-agent': req.headers['user-agent']?.substring(0, 50)
    });

    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({
        status: 'error',
        message: 'Please log in to access this resource',
        debug: {
          cookiePresent: !!req.cookies.jwt,
          authHeaderPresent: !!req.headers.authorization,
          authHeaderValue: req.headers.authorization ? req.headers.authorization.substring(0, 20) + '...' : 'None'
        }
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    console.log('Token decoded successfully for user:', decoded.id);

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    console.log('User authenticated:', user.username, 'Role:', user.role);

    // 4) Grant access to protected route
    req.user = user;
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again',
      debug: {
        error: error.message,
        tokenPresent: !!req.headers.authorization || !!req.cookies.jwt
      }
    });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
}; 