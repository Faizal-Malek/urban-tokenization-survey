"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionnaire_controller_1 = require("../controllers/questionnaire.controller");
const router = express_1.default.Router();
router.post('/', questionnaire_controller_1.submitQuestionnaire);
router.get('/analytics', questionnaire_controller_1.getAnalytics);
exports.default = router;
