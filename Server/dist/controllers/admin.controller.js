"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = void 0;
const user_model_1 = require("../models/user.model");
const errorHandler_1 = require("../middleware/errorHandler");
const getAllUsers = async (req, res, next) => {
    try {
        const users = await user_model_1.User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.params.id);
        if (!user) {
            return next(new errorHandler_1.AppError('No user found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUser = getUser;
const updateUser = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return next(new errorHandler_1.AppError('No user found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(new errorHandler_1.AppError('No user found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
