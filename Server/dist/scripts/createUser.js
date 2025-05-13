"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = require("../models/user.model");
dotenv_1.default.config();
const createUser = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        const userExists = await user_model_1.User.findOne({ username: 'user' });
        if (userExists) {
            console.log('User already exists');
            process.exit(0);
        }
        const user = await user_model_1.User.create({
            username: 'user',
            password: 'adminadmin',
            role: 'user',
        });
        console.log('User created successfully:', user);
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
};
createUser();
