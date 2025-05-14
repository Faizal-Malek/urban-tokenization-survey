import { createContext, useContext, useState, ReactNode } from 'react';
import axios from "axios";

export type QuestionnaireSection = 'demographics' | 'knowledge' | 'policy' | 'tokenization' | 'stakeholders' | 'future';

interface DemographicsData {
  occupation: string;
  customOccupation?: string;
  educationLevel: string;
  customEducation?: string;
  yearsOfExperience: string;
}

interface KnowledgeData {
  blockchainFamiliarity: string;
  tokenizationFamiliarity: string;
  participatedProjects: string;
  projectDescription?: string;
}

interface PolicyData {
  currentPoliciesPromote: string;
  challenges: string[];
  governmentSupport: string;
}

interface TokenizationData {
  benefitAreas: string[];
  benefits: string[];
  challenges: string[];
  enhanceEfficiency: string;
  stakeholderViews: string;
}

interface StakeholdersData {
  leadStakeholders: string[];
  collaborationImportance: string;
  governanceModels: string[];
  strategies: string[];
}

interface FutureData {
  adoptionLikelihood: string;
  factorsText: string;
  futureVisionText: string;
  contactInfo?: string;
}

export interface QuestionnaireData {
  demographics: DemographicsData;
  knowledge: KnowledgeData;
  policy: PolicyData;
  tokenization: TokenizationData;
  stakeholders: StakeholdersData;
  future: FutureData;
}

interface QuestionnaireContextType {
  currentSection: QuestionnaireSection;
  setCurrentSection: (section: QuestionnaireSection) => void;
  formData: QuestionnaireData;
  updateFormData: (section: QuestionnaireSection, data: any) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  submitForm: () => Promise<void>;
}

const defaultQuestionnaireData: QuestionnaireData = {
  demographics: {
    occupation: '',
    educationLevel: '',
    yearsOfExperience: '',
  },
  knowledge: {
    blockchainFamiliarity: '',
    tokenizationFamiliarity: '',
    participatedProjects: '',
    projectDescription: '',
  },
  policy: {
    currentPoliciesPromote: '',
    challenges: [],
    governmentSupport: '',
  },
  tokenization: {
    benefitAreas: [],
    benefits: [],
    challenges: [],
    enhanceEfficiency: '',
    stakeholderViews: '',
  },
  stakeholders: {
    leadStakeholders: [],
    collaborationImportance: '',
    governanceModels: [],
    strategies: [],
  },
  future: {
    adoptionLikelihood: '',
    factorsText: '',
    futureVisionText: '',
    contactInfo: '',
  },
};

export const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const [currentSection, setCurrentSection] = useState<QuestionnaireSection>('demographics');
  const [formData, setFormData] = useState<QuestionnaireData>(defaultQuestionnaireData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (section: QuestionnaireSection, data: any) => {
    setFormData((prev) => {
      const updatedSection = {
        ...prev[section],
        ...data
      };
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(
        "https://urban-tokenization-survey.onrender.com/api/questionnaire",
        formData,
        { withCredentials: true }
      );
      window.location.href = 'https://planera.co.za';
      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      return Promise.reject(error);
    }
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        formData,
        updateFormData,
        isSubmitting,
        setIsSubmitting,
        submitForm,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};
