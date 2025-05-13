
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import { DemographicsSection } from "./sections/DemographicsSection";
import { KnowledgeSection } from "./sections/KnowledgeSection";
import { PolicySection } from "./sections/PolicySection";
import { TokenizationSection } from "./sections/TokenizationSection";
import { StakeholdersSection } from "./sections/StakeholdersSection";
import { FutureSection } from "./sections/FutureSection";
import { QuestionnaireNav } from "./QuestionnaireNav";
import { Progress } from "./ui/progress";

export function Questionnaire() {
  const { currentSection } = useQuestionnaire();

  // Calculate progress percentage based on current section
  const getProgressPercentage = () => {
    const sections = ["demographics", "knowledge", "policy", "tokenization", "stakeholders", "future"];
    const currentIndex = sections.indexOf(currentSection);
    return ((currentIndex) / (sections.length - 1)) * 100;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <QuestionnaireNav />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-brand-yellow">Tokenization in Urban Infrastructure Management</h2>
          <p className="text-brand-yellow/70">Please complete all sections of this questionnaire.</p>
          <Progress value={getProgressPercentage()} className="h-2 mt-4 bg-gray-900" />
        </div>
        
        <div className="max-w-4xl mx-auto">
          {currentSection === "demographics" && <DemographicsSection />}
          {currentSection === "knowledge" && <KnowledgeSection />}
          {currentSection === "policy" && <PolicySection />}
          {currentSection === "tokenization" && <TokenizationSection />}
          {currentSection === "stakeholders" && <StakeholdersSection />}
          {currentSection === "future" && <FutureSection />}
        </div>
      </div>
    </div>
  );
}
