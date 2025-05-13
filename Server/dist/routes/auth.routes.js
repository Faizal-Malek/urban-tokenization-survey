"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const router = express_1.default.Router();
router.post('/register', [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
], validateRequest_1.validateRequest, auth_controller_1.register);
router.post('/login', [
    (0, express_validator_1.body)('username').trim().notEmpty().withMessage('Username is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
], validateRequest_1.validateRequest, auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
exports.default = router;
