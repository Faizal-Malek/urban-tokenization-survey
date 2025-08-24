"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const errorHandler_1 = require("./errorHandler");
const protect = async (req, res, next) => {
    var _a;
    try {
        let token;
        // 1) Get token from cookies or Authorization header
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
            console.log('Token found in cookies');
        }
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token found in Authorization header');
        }
        // Debug logging
        console.log('Auth middleware - Headers:', {
            authorization: req.headers.authorization ? 'Present' : 'Missing',
            origin: req.headers.origin,
            'user-agent': (_a = req.headers['user-agent']) === null || _a === void 0 ? void 0 : _a.substring(0, 50)
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully for user:', decoded.id);
        // 3) Check if user still exists
        const user = await user_model_1.User.findById(decoded.id);
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
    }
    catch (error) {
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
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
