"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = require("../models/user.model");
dotenv_1.default.config();
const createAdminUser = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        const adminExists = await user_model_1.User.findOne({ username: 'Admin' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        const admin = await user_model_1.User.create({
            username: 'Admin',
            password: 'passwordAdmin1',
            role: 'admin',
        });
        console.log('Admin user created successfully:', admin);
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};
createAdminUser();
