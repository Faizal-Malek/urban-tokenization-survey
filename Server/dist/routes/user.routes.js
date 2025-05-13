"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
// Protect all routes after this middleware
router.use(auth_middleware_1.protect);
router.get('/me', user_controller_1.getMe);
router.patch('/update-me', user_controller_1.updateMe);
exports.default = router;
