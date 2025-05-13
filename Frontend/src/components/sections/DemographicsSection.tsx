import { useQuestionnaire } from "@/context/QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function DemographicsSection() {
  const { formData, updateFormData, setCurrentSection } = useQuestionnaire();
  const { occupation, educationLevel, yearsOfExperience } = formData.demographics;

  const handleContinue = () => {
    if (!occupation || !educationLevel || !yearsOfExperience) {
      toast.error("Please complete all fields before continuing.");
      return;
    }
    setCurrentSection("knowledge");
    toast.success("Demographics saved! Moving to Knowledge section.");
    // Add smooth scrolling to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOccupationChange = (value: string) => {
    updateFormData("demographics", { occupation: value });
  };

  const handleEducationChange = (value: string) => {
    updateFormData("demographics", { educationLevel: value });
  };

  const handleExperienceChange = (value: string) => {
    updateFormData("demographics", { yearsOfExperience: value });
  };

  const handleCustomOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("demographics", { occupation: e.target.value });
  };

  const handleCustomEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("demographics", { educationLevel: e.target.value });
  };

  return (
    <Card className="w-full relative bg-white opacity-90 before:bg-[url('/jhbStreets.png')] before:absolute before:inset-0 before:opacity-[0.1] before:z-[-1] text-black">
      <CardHeader>
        <CardTitle>Section A: Demographic Information</CardTitle>
        <CardDescription>
          Tell us about your professional background and experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Occupation */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Occupation</h3>
          <RadioGroup 
            value={occupation} 
            onValueChange={handleOccupationChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Urban Planner" id="r1" />
              <Label htmlFor="r1">Urban Planner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Developer/Investor" id="r2" />
              <Label htmlFor="r2">Developer/Investor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Government Official/Policy Maker" id="r3" />
              <Label htmlFor="r3">Government Official/Policy Maker</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Technology Professional" id="r4" />
              <Label htmlFor="r4">Technology Professional (Blockchain/IT)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Academic/Researcher" id="r5" />
              <Label htmlFor="r5">Academic/Researcher</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Other" id="r6" />
              <Label htmlFor="r6">Other</Label>
            </div>
            {occupation === "Other" && (
              <div className="ml-6 mt-2">
                <Input 
                  placeholder="Please specify" 
                  className="max-w-xs"
                  onChange={handleCustomOccupationChange}
                />
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Education Level */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Education Level</h3>
          <RadioGroup 
            value={educationLevel} 
            onValueChange={handleEducationChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="High School" id="e1" />
              <Label htmlFor="e1">High School</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Diploma/Certificate" id="e2" />
              <Label htmlFor="e2">Diploma/Certificate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Bachelor's Degree" id="e3" />
              <Label htmlFor="e3">Bachelor's Degree</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Master's Degree" id="e4" />
              <Label htmlFor="e4">Master's Degree</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Ph.D." id="e5" />
              <Label htmlFor="e5">Ph.D.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Other" id="e6" />
              <Label htmlFor="e6">Other</Label>
            </div>
            {educationLevel === "Other" && (
              <div className="ml-6 mt-2">
                <Input 
                  placeholder="Please specify" 
                  className="max-w-xs"
                  onChange={handleCustomEducationChange}
                />
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Years of Experience */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Years of Experience in the Field</h3>
          <RadioGroup 
            value={yearsOfExperience} 
            onValueChange={handleExperienceChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Less than 5 years" id="y1" />
              <Label htmlFor="y1">Less than 5 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5-10 years" id="y2" />
              <Label htmlFor="y2">5-10 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="10-15 years" id="y3" />
              <Label htmlFor="y3">10-15 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="More than 15 years" id="y4" />
              <Label htmlFor="y4">More than 15 years</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled>Back</Button>
        <Button onClick={handleContinue}>Continue</Button>
      </CardFooter>
    </Card>
  );
}
