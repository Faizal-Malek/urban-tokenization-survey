import { Request, Response, NextFunction } from 'express';
import { Questionnaire } from '../models/questionnaire.model';

export const submitQuestionnaire = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No data provided in the request'
      });
    }

    const submission = await Questionnaire.create({ responses: req.body });
    res.status(201).json({ status: 'success', data: submission });
  } catch (error) {
    // Send a more specific error message
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit questionnaire',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
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