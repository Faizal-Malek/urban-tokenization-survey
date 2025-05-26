"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
// Protect all routes after this middleware
router.use(auth_middleware_1.protect);
router.use((0, auth_middleware_1.restrictTo)('admin'));
router.route('/users').get(admin_controller_1.getAllUsers);
router.route('/users/:id').get(admin_controller_1.getUser).patch(admin_controller_1.updateUser).delete(admin_controller_1.deleteUser);
router.route('/questionnaires').get(admin_controller_1.getAllQuestionnaires);
exports.default = router;
