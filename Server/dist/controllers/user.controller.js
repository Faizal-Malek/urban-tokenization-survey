"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = exports.getMe = void 0;
const user_model_1 = require("../models/user.model");
const getMe = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user._id);
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
exports.getMe = getMe;
const updateMe = async (req, res, next) => {
    try {
        // Filter out unwanted fields
        const filteredBody = { ...req.body };
        const allowedFields = ['username'];
        Object.keys(filteredBody).forEach((el) => {
            if (!allowedFields.includes(el))
                delete filteredBody[el];
        });
        const user = await user_model_1.User.findByIdAndUpdate(req.user._id, filteredBody, {
            new: true,
            runValidators: true,
        });
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
exports.updateMe = updateMe;
