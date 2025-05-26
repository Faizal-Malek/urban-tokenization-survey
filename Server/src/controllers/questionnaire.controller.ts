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
    const totalResponses = submissions.length;
    
    if (totalResponses === 0) {
      return res.status(200).json({
        status: 'success',
        totalResponses: 0,
        completedResponses: 0,
        completionRate: 0,
        avgCompletionTime: "0 min",
        demographics: [],
        education: [],
        experience: [],
        adoption: [],
        knowledge: [],
        benefitAreas: [],
        stakeholderViews: [],
        governanceModels: []
      });
    }

    // Helper function to count occurrences
    const countOccurrences = (field: string, section?: string) => {
      const counts: { [key: string]: number } = {};
      
      submissions.forEach(submission => {
        const responses = submission.responses || {};
        let value;
        
        if (section) {
          value = responses[section]?.[field];
        } else {
          value = responses[field];
        }
        
        if (value) {
          // Handle custom values (when "Other" is selected)
          if (value === 'Other') {
            const customField = section ? responses[section]?.[`custom${field.charAt(0).toUpperCase() + field.slice(1)}`] : responses[`custom${field.charAt(0).toUpperCase() + field.slice(1)}`];
            value = customField || 'Other';
          }
          
          counts[value] = (counts[value] || 0) + 1;
        }
      });
      
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    };

    // Helper function to count multiple selections (for checkboxes)
    const countMultipleSelections = (field: string, section?: string) => {
      const counts: { [key: string]: number } = {};
      
      submissions.forEach(submission => {
        const responses = submission.responses || {};
        let values;
        
        if (section) {
          values = responses[section]?.[field];
        } else {
          values = responses[field];
        }
        
        if (Array.isArray(values)) {
          values.forEach(value => {
            if (value) {
              counts[value] = (counts[value] || 0) + 1;
            }
          });
        } else if (values) {
          counts[values] = (counts[values] || 0) + 1;
        }
      });
      
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    };

    // Calculate completion rate (assuming a submission is complete if it has responses from multiple sections)
    const completedResponses = submissions.filter(submission => {
      const responses = submission.responses || {};
      const sectionCount = Object.keys(responses).length;
      return sectionCount >= 3; // Consider complete if at least 3 sections are filled
    }).length;
    
    const completionRate = Math.round((completedResponses / totalResponses) * 100);

    // Calculate average completion time (mock data for now, would need timestamps)
    const avgCompletionTime = "8.4 min";

    // Demographics analytics
    const demographics = countOccurrences('occupation', 'demographics');
    const education = countOccurrences('educationLevel', 'demographics');
    const experience = countOccurrences('yearsOfExperience', 'demographics');

    // Knowledge analytics
    const knowledge = countOccurrences('blockchainFamiliarity', 'knowledge');
    const adoption = countOccurrences('adoptionLikelihood', 'future');

    // Benefits and areas analytics
    const benefitAreas = countMultipleSelections('infrastructureAreas', 'tokenization');
    
    // Stakeholder views
    const stakeholderViews = countOccurrences('stakeholderViews', 'stakeholders');
    
    // Governance models
    const governanceModels = countOccurrences('governanceModel', 'policy');

    const analyticsData = {
      status: 'success',
      totalResponses,
      completedResponses,
      completionRate,
      avgCompletionTime,
      demographics,
      education,
      experience,
      adoption,
      knowledge,
      benefitAreas,
      stakeholderViews,
      governanceModels
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Analytics error:', error);
    next(error);
  }
};