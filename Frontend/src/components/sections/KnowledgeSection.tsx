import { useQuestionnaire } from "@/context/QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function KnowledgeSection() {
  const { formData, updateFormData, setCurrentSection } = useQuestionnaire();
  const { blockchainFamiliarity, tokenizationFamiliarity, participatedProjects, projectDescription } = formData.knowledge;

  const handleContinue = () => {
    if (!blockchainFamiliarity || !tokenizationFamiliarity || !participatedProjects) {
      toast.error("Please complete all required fields before continuing.");
      return;
    }
    
    if (participatedProjects === 'Yes' && !projectDescription) {
      toast.error("Please describe your project experience.");
      return;
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentSection("policy");
    toast.success("Knowledge and awareness info saved! Moving to Policy section.");
  };

  const handleBack = () => {
    setCurrentSection("demographics");
  };

  return (
    <Card className="w-full relative bg-white opacity-90 before:bg-[url('/jhbStreets.png')] before:absolute before:inset-0 before:opacity-[0.1] before:z-[-1] text-black">

      <CardHeader>
        <CardTitle>Section B: Knowledge and Awareness of Blockchain and Tokenization</CardTitle>
        <CardDescription>
          Help us understand your familiarity with blockchain technology and tokenization concepts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Blockchain Familiarity */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">How familiar are you with blockchain technology?</h3>
          <RadioGroup 
            value={blockchainFamiliarity} 
            onValueChange={(value) => updateFormData("knowledge", { blockchainFamiliarity: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Very familiar" id="bf1" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="bf1">Very familiar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Somewhat familiar" id="bf2" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="bf2">Somewhat familiar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Neutral" id="bf3" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="bf3">Neutral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Somewhat unfamiliar" id="bf4" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="bf4">Somewhat unfamiliar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Not familiar at all" id="bf5" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="bf5">Not familiar at all</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Tokenization Familiarity */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">How familiar are you with tokenization (i.e., converting real-world assets into digital tokens)?</h3>
          <RadioGroup 
            value={tokenizationFamiliarity} 
            onValueChange={(value) => updateFormData("knowledge", { tokenizationFamiliarity: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Very familiar" id="tf1" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="tf1">Very familiar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Somewhat familiar" id="tf2" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="tf2">Somewhat familiar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Neutral" id="tf3" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="tf3">Neutral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Somewhat unfamiliar" id="tf4" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="tf4">Somewhat unfamiliar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Not familiar at all" id="tf5" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="tf5">Not familiar at all</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Project Participation */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Have you participated in any projects or initiatives using blockchain or tokenization?</h3>
          <RadioGroup 
            value={participatedProjects} 
            onValueChange={(value) => updateFormData("knowledge", { participatedProjects: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="pp1" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="pp1">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="pp2" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="pp2">No</Label>
            </div>
          </RadioGroup>

          {participatedProjects === 'Yes' && (
            <div className="mt-3">
              <Label htmlFor="project-description">Please briefly describe the project:</Label>
              <Textarea 
                id="project-description" 
                value={projectDescription}
                onChange={(e) => updateFormData("knowledge", { projectDescription: e.target.value })}
                placeholder="Please provide a brief description of the project..."
                className="mt-2"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button onClick={handleContinue}>Continue</Button>
      </CardFooter>
    </Card>
  );
}
