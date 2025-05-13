
import { useQuestionnaire, QuestionnaireSection } from "@/context/QuestionnaireContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface NavItemProps {
  label: string;
  section: QuestionnaireSection;
  completed?: boolean;
  current?: boolean;
}

const NavItem = ({ label, section, completed, current }: NavItemProps) => {
  const { setCurrentSection } = useQuestionnaire();

  const handleClick = () => {
    setCurrentSection(section);
    toast.info(`Navigated to ${label}`);
  };

  return (
    <Button
      variant={current ? "default" : "ghost"}
      className={cn(
        "w-full justify-start mb-1 relative",
        current ? "bg-brand hover:bg-brand-dark" : "",
        completed ? "text-brand dark:text-brand-light" : ""
      )}
      onClick={handleClick}
    >
      {label}
      {completed && (
        <CheckCircle size={16} className="ml-auto text-green-500" />
      )}
    </Button>
  );
};

export function QuestionnaireNav() {
  const { currentSection, formData } = useQuestionnaire();

  // Determine which sections are completed
  const isDemographicsComplete = Boolean(
    formData.demographics.occupation && 
    formData.demographics.educationLevel && 
    formData.demographics.yearsOfExperience
  );
  
  const isKnowledgeComplete = Boolean(
    formData.knowledge.blockchainFamiliarity && 
    formData.knowledge.tokenizationFamiliarity && 
    formData.knowledge.participatedProjects
  );
  
  const isPolicyComplete = Boolean(
    formData.policy.currentPoliciesPromote && 
    formData.policy.challenges.length > 0 && 
    formData.policy.governmentSupport
  );
  
  const isTokenizationComplete = Boolean(
    formData.tokenization.benefitAreas.length > 0 && 
    formData.tokenization.benefits.length > 0 && 
    formData.tokenization.challenges.length > 0 &&
    formData.tokenization.enhanceEfficiency &&
    formData.tokenization.stakeholderViews
  );
  
  const isStakeholdersComplete = Boolean(
    formData.stakeholders.leadStakeholders.length > 0 && 
    formData.stakeholders.collaborationImportance && 
    formData.stakeholders.governanceModels.length > 0 &&
    formData.stakeholders.strategies.length > 0
  );
  
  const isFutureComplete = Boolean(
    formData.future.adoptionLikelihood && 
    formData.future.factorsText && 
    formData.future.futureVisionText
  );

  return (
    <div className="w-64 border-r p-4 hidden md:block">
      <div className="space-y-1">
        <h2 className="font-semibold text-lg mb-4">Questionnaire Sections</h2>
        <NavItem 
          label="A: Demographics" 
          section="demographics"
          completed={isDemographicsComplete}
          current={currentSection === "demographics"}
        />
        <NavItem 
          label="B: Knowledge" 
          section="knowledge"
          completed={isKnowledgeComplete}
          current={currentSection === "knowledge"}
        />
        <NavItem 
          label="C: Policy" 
          section="policy"
          completed={isPolicyComplete}
          current={currentSection === "policy"}
        />
        <NavItem 
          label="D: Tokenization" 
          section="tokenization"
          completed={isTokenizationComplete}
          current={currentSection === "tokenization"}
        />
        <NavItem 
          label="E: Stakeholders" 
          section="stakeholders"
          completed={isStakeholdersComplete}
          current={currentSection === "stakeholders"}
        />
        <NavItem 
          label="F: Future Outlook" 
          section="future"
          completed={isFutureComplete}
          current={currentSection === "future"}
        />
      </div>

      <div className="mt-8 border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Complete all sections to submit the questionnaire.
        </p>
      </div>
    </div>
  );
}
