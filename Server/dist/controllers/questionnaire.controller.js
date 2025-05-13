"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.submitQuestionnaire = void 0;
const questionnaire_model_1 = require("../models/questionnaire.model");
const submitQuestionnaire = async (req, res, next) => {
    try {
        const submission = await questionnaire_model_1.Questionnaire.create({ responses: req.body });
        res.status(201).json({ status: 'success', data: submission });
    }
    catch (error) {
        next(error);
    }
};
exports.submitQuestionnaire = submitQuestionnaire;
const getAnalytics = async (req, res, next) => {
    try {
        const submissions = await questionnaire_model_1.Questionnaire.find();
        // Example analytics: count, and you can expand this as needed
        const totalResponses = submissions.length;
        // You can add more analytics processing here
        res.status(200).json({ status: 'success', totalResponses, submissions });
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalytics = getAnalytics;
