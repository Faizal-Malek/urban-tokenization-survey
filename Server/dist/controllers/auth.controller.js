"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const errorHandler_1 = require("../middleware/errorHandler");
const signToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id, user.role);
    const cookieOptions = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
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
const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const existingUser = await user_model_1.User.findOne({ username });
        if (existingUser) {
            return next(new errorHandler_1.AppError('Username already exists', 400));
        }
        const user = await user_model_1.User.create({
            username,
            password,
            role: 'user',
        });
        createSendToken(user, 201, res);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await user_model_1.User.findOne({ username }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return next(new errorHandler_1.AppError('Incorrect username or password', 401));
        }
        createSendToken(user, 200, res);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};
exports.logout = logout;
