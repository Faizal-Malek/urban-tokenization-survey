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
    try {
        // 1) Get token from cookies
        const token = req.cookies.jwt;
        if (!token) {
            return next(new errorHandler_1.AppError('Please log in to access this resource', 401));
        }
        // 2) Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 3) Check if user still exists
        const user = await user_model_1.User.findById(decoded.id);
        if (!user) {
            return next(new errorHandler_1.AppError('User no longer exists', 401));
        }
        // 4) Grant access to protected route
        req.user = user;
        next();
    }
    catch (error) {
        next(new errorHandler_1.AppError('Invalid token. Please log in again', 401));
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
