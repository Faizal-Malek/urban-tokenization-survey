import { Request, Response, NextFunction } from 'express';
import { Questionnaire } from '../models/questionnaire.model';

export const submitQuestionnaire = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submission = await Questionnaire.create({ responses: req.body });
    res.status(201).json({ status: 'success', data: submission });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissions = await Questionnaire.find();
    // Example analytics: count, and you can expand this as needed
    const totalResponses = submissions.length;
    // You can add more analytics processing here
    res.status(200).json({ status: 'success', totalResponses, submissions });
  } catch (error) {
    next(error);
  }
}; 