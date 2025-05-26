import mongoose from 'mongoose';
import { Questionnaire } from './models/questionnaire.model';
import dotenv from 'dotenv';

dotenv.config();

// Sample test data for analytics
const sampleData = [
  {
    responses: {
      demographics: {
        occupation: 'Software Developer',
        educationLevel: 'Bachelor\'s Degree',
        yearsOfExperience: '3-5 years',
        location: 'New York'
      },
      knowledge: {
        blockchainFamiliarity: 'Intermediate',
        technologyReadiness: 'High'
      },
      tokenization: {
        infrastructureAreas: ['Transportation', 'Energy'],
        priorities: ['Security', 'Scalability']
      },
      challenges: {
        barriers: ['Regulatory Uncertainty', 'Technical Complexity']
      },
      stakeholders: {
        stakeholderViews: 'Government'
      },
      policy: {
        governanceModel: 'Hybrid'
      },
      future: {
        adoptionLikelihood: 'Very Likely'
      },
      feedback: {
        overallSatisfaction: 'Satisfied'
      }
    }
  },
  {
    responses: {
      demographics: {
        occupation: 'Urban Planner',
        educationLevel: 'Master\'s Degree',
        yearsOfExperience: '5-10 years',
        location: 'San Francisco'
      },
      knowledge: {
        blockchainFamiliarity: 'Beginner',
        technologyReadiness: 'Medium'
      },
      tokenization: {
        infrastructureAreas: ['Housing', 'Transportation'],
        priorities: ['Transparency', 'Efficiency']
      },
      challenges: {
        barriers: ['Cost', 'Public Acceptance']
      },
      stakeholders: {
        stakeholderViews: 'Private Sector'
      },
      policy: {
        governanceModel: 'Centralized'
      },
      future: {
        adoptionLikelihood: 'Likely'
      },
      feedback: {
        overallSatisfaction: 'Very Satisfied'
      }
    }
  },
  {
    responses: {
      demographics: {
        occupation: 'Policy Analyst',
        educationLevel: 'PhD',
        yearsOfExperience: '10+ years',
        location: 'Washington DC'
      },
      knowledge: {
        blockchainFamiliarity: 'Expert',
        technologyReadiness: 'Very High'
      },
      tokenization: {
        infrastructureAreas: ['Governance', 'Energy', 'Transportation'],
        priorities: ['Regulatory Compliance', 'Security', 'Interoperability']
      },
      challenges: {
        barriers: ['Regulatory Uncertainty', 'Scalability Issues']
      },
      stakeholders: {
        stakeholderViews: 'Academic'
      },
      policy: {
        governanceModel: 'Decentralized'
      },
      future: {
        adoptionLikelihood: 'Very Likely'
      },
      feedback: {
        overallSatisfaction: 'Very Satisfied'
      }
    }
  }
];

async function seedTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Questionnaire.deleteMany({});
    // console.log('Cleared existing questionnaire data');

    // Insert sample data
    const insertedData = await Questionnaire.insertMany(sampleData);
    console.log(`Inserted ${insertedData.length} sample questionnaire responses`);

    // Test the analytics by fetching data
    const submissions = await Questionnaire.find();
    console.log(`Total submissions in database: ${submissions.length}`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding test data:', error);
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedTestData();
}

export { seedTestData };