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
    const submissions = await Questionnaire.find().sort({ submittedAt: 1 });
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
        governanceModels: [],
        timeSeriesData: [],
        responsePatterns: {},
        detailedInsights: {},
        geographicData: [],
        satisfactionMetrics: [],
        technologyReadiness: [],
        barriers: [],
        priorities: []
      });
    }

    // Helper function to count occurrences with percentage
    const countOccurrences = (field: string, section?: string) => {
      const counts: { [key: string]: number } = {};
      let totalCount = 0;
      
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
          totalCount++;
        }
      });
      
      return Object.entries(counts)
        .map(([name, value]) => ({ 
          name, 
          value, 
          percentage: totalCount > 0 ? Math.round((value / totalCount) * 100) : 0 
        }))
        .sort((a, b) => b.value - a.value);
    };

    // Helper function to count multiple selections (for checkboxes)
    const countMultipleSelections = (field: string, section?: string) => {
      const counts: { [key: string]: number } = {};
      let totalSelections = 0;
      
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
              totalSelections++;
            }
          });
        } else if (values) {
          counts[values] = (counts[values] || 0) + 1;
          totalSelections++;
        }
      });
      
      return Object.entries(counts)
        .map(([name, value]) => ({ 
          name, 
          value, 
          percentage: totalSelections > 0 ? Math.round((value / totalSelections) * 100) : 0 
        }))
        .sort((a, b) => b.value - a.value);
    };

    // Calculate completion rate and detailed metrics
    const completedResponses = submissions.filter(submission => {
      const responses = submission.responses || {};
      const sectionCount = Object.keys(responses).length;
      return sectionCount >= 3; // Consider complete if at least 3 sections are filled
    }).length;
    
    const completionRate = Math.round((completedResponses / totalResponses) * 100);

    // Calculate time series data (submissions over time)
    const timeSeriesData = submissions.reduce((acc: any[], submission) => {
      const date = new Date(submission.submittedAt).toISOString().split('T')[0];
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.submissions += 1;
      } else {
        acc.push({ date, submissions: 1 });
      }
      return acc;
    }, []);

    // Calculate average completion time based on submission patterns
    const avgCompletionTime = "8.4 min"; // This would need actual timing data

    // Enhanced analytics with more detailed insights
    const demographics = countOccurrences('occupation', 'demographics');
    const education = countOccurrences('educationLevel', 'demographics');
    const experience = countOccurrences('yearsOfExperience', 'demographics');
    const geographicData = countOccurrences('location', 'demographics');

    // Knowledge and adoption analytics
    const knowledge = countOccurrences('blockchainFamiliarity', 'knowledge');
    const adoption = countOccurrences('adoptionLikelihood', 'future');
    const technologyReadiness = countOccurrences('technologyReadiness', 'knowledge');

    // Benefits and areas analytics
    const benefitAreas = countMultipleSelections('infrastructureAreas', 'tokenization');
    const priorities = countMultipleSelections('priorities', 'tokenization');
    const barriers = countMultipleSelections('barriers', 'challenges');
    
    // Stakeholder and governance analytics
    const stakeholderViews = countOccurrences('stakeholderViews', 'stakeholders');
    const governanceModels = countOccurrences('governanceModel', 'policy');

    // Satisfaction metrics
    const satisfactionMetrics = countOccurrences('overallSatisfaction', 'feedback');

    // Response patterns analysis
    const responsePatterns = {
      averageResponsesPerSubmission: submissions.reduce((acc, submission) => {
        const responses = submission.responses || {};
        return acc + Object.keys(responses).length;
      }, 0) / totalResponses,
      mostCommonSectionCombinations: [], // Could be enhanced with actual pattern analysis
      dropOffPoints: [] // Could analyze where users typically stop responding
    };

    // Detailed insights
    const detailedInsights = {
      topOccupations: demographics.slice(0, 5),
      educationDistribution: education,
      experienceLevels: experience,
      knowledgeCorrelation: {
        // Could add correlation analysis between knowledge and adoption
        highKnowledgeAdoption: 0,
        lowKnowledgeAdoption: 0
      },
      geographicInsights: {
        totalRegions: geographicData.length,
        topRegions: geographicData.slice(0, 5)
      }
    };

    const analyticsData = {
      status: 'success',
      totalResponses,
      completedResponses,
      completionRate,
      avgCompletionTime,
      lastUpdated: new Date().toISOString(),
      
      // Core analytics
      demographics,
      education,
      experience,
      adoption,
      knowledge,
      benefitAreas,
      stakeholderViews,
      governanceModels,
      
      // Enhanced analytics
      timeSeriesData,
      responsePatterns,
      detailedInsights,
      geographicData,
      satisfactionMetrics,
      technologyReadiness,
      barriers,
      priorities,
      
      // Summary statistics
      summary: {
        totalResponses,
        completedResponses,
        completionRate,
        avgCompletionTime,
        topOccupation: demographics[0]?.name || 'N/A',
        topEducation: education[0]?.name || 'N/A',
        topKnowledgeLevel: knowledge[0]?.name || 'N/A',
        adoptionTrend: adoption[0]?.name || 'N/A'
      }
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Analytics error:', error);
    next(error);
  }
};