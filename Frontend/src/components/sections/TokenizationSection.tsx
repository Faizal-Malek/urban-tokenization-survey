import { useQuestionnaire } from "@/context/QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export function TokenizationSection() {
  const { formData, updateFormData, setCurrentSection } = useQuestionnaire();
  const { benefitAreas, benefits, challenges, enhanceEfficiency, stakeholderViews } = formData.tokenization;
  
  const [otherBenefitArea, setOtherBenefitArea] = useState("");
  const [otherBenefit, setOtherBenefit] = useState("");
  const [otherChallenge, setOtherChallenge] = useState("");
  
  const benefitAreaOptions = [
    { id: "ba1", value: "Energy grids", label: "Energy grids" },
    { id: "ba2", value: "Transportation networks", label: "Transportation networks" },
    { id: "ba3", value: "Water supply systems", label: "Water supply systems" },
    { id: "ba4", value: "Waste management", label: "Waste management" },
    { id: "ba5", value: "Real estate development", label: "Real estate development" },
    { id: "ba6", value: "Other", label: "Other" }
  ];
  
  const benefitOptions = [
    { id: "b1", value: "Improved resource allocation", label: "Improved resource allocation" },
    { id: "b2", value: "Increased transparency and accountability", label: "Increased transparency and accountability" },
    { id: "b3", value: "Cost reduction", label: "Cost reduction" },
    { id: "b4", value: "Enhanced stakeholder participation", label: "Enhanced stakeholder participation" },
    { id: "b5", value: "Facilitating capital raising", label: "Facilitating capital raising for infrastructure projects" },
    { id: "b6", value: "Other", label: "Other" }
  ];
  
  const challengeOptions = [
    { id: "c1", value: "Technological complexity", label: "Technological complexity and scalability issues" },
    { id: "c2", value: "Security vulnerabilities", label: "Security vulnerabilities (e.g., hacking, fraud)" },
    { id: "c3", value: "Resistance from stakeholders", label: "Resistance from stakeholders" },
    { id: "c4", value: "Lack of expertise", label: "Lack of expertise and knowledge" },
    { id: "c5", value: "Regulatory uncertainty", label: "Regulatory uncertainty" },
    { id: "c6", value: "Other", label: "Other" }
  ];

  const handleBenefitAreaChange = (checked: boolean, area: string) => {
    if (checked) {
      updateFormData("tokenization", { benefitAreas: [...benefitAreas, area] });
    } else {
      updateFormData("tokenization", { benefitAreas: benefitAreas.filter(a => a !== area) });
    }
  };
  
  const handleBenefitChange = (checked: boolean, benefit: string) => {
    if (checked) {
      updateFormData("tokenization", { benefits: [...benefits, benefit] });
    } else {
      updateFormData("tokenization", { benefits: benefits.filter(b => b !== benefit) });
    }
  };
  
  const handleChallengeChange = (checked: boolean, challenge: string) => {
    if (checked) {
      updateFormData("tokenization", { challenges: [...challenges, challenge] });
    } else {
      updateFormData("tokenization", { challenges: challenges.filter(c => c !== challenge) });
    }
  };
  
  const handleAddOtherBenefitArea = () => {
    if (otherBenefitArea.trim() && !benefitAreas.includes(otherBenefitArea)) {
      updateFormData("tokenization", { benefitAreas: [...benefitAreas, otherBenefitArea] });
      setOtherBenefitArea("");
      toast.success("Custom benefit area added!");
    } else {
      toast.error("Please enter a unique benefit area");
    }
  };
  
  const handleAddOtherBenefit = () => {
    if (otherBenefit.trim() && !benefits.includes(otherBenefit)) {
      updateFormData("tokenization", { benefits: [...benefits, otherBenefit] });
      setOtherBenefit("");
      toast.success("Custom benefit added!");
    } else {
      toast.error("Please enter a unique benefit");
    }
  };
  
  const handleAddOtherChallenge = () => {
    if (otherChallenge.trim() && !challenges.includes(otherChallenge)) {
      updateFormData("tokenization", { challenges: [...challenges, otherChallenge] });
      setOtherChallenge("");
      toast.success("Custom challenge added!");
    } else {
      toast.error("Please enter a unique challenge");
    }
  };

  const handleContinue = () => {
    if (benefitAreas.length === 0 || benefits.length === 0 || challenges.length === 0 || !enhanceEfficiency || !stakeholderViews) {
      toast.error("Please complete all fields before continuing.");
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentSection("stakeholders");
    toast.success("Tokenization information saved! Moving to Stakeholders section.");
  };

  const handleBack = () => {
    setCurrentSection("policy");
  };

  return (
    <Card className="w-full relative bg-white opacity-90 before:bg-[url('/jhbStreets.png')] before:absolute before:inset-0 before:opacity-[0.1] before:z-[-1] text-black">

      <CardHeader>
        <CardTitle>Section D: Tokenization in Urban Infrastructure Management</CardTitle>
        <CardDescription>
          Share your perspectives on how tokenization can impact urban infrastructure management.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Benefit Areas */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Which areas of urban infrastructure management do you believe would benefit most from tokenization?</h3>
          <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
          
          <div className="grid gap-2">
            {benefitAreaOptions.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={area.id} 
                  checked={benefitAreas.includes(area.value)}
                  onCheckedChange={(checked) => handleBenefitAreaChange(checked as boolean, area.value)}
                />
                <Label htmlFor={area.id}>{area.label}</Label>
              </div>
            ))}
            
            {benefitAreas.includes("Other") && (
              <div className="flex items-center space-x-2 ml-6 mt-2">
                <Input 
                  value={otherBenefitArea}
                  onChange={(e) => setOtherBenefitArea(e.target.value)}
                  placeholder="Specify other benefit area"
                  className="w-72"
                />
                <Button size="sm" variant="outline" onClick={handleAddOtherBenefitArea}>
                  Add
                </Button>
              </div>
            )}
          </div>
          
          {benefitAreas.filter(a => a !== "Other" && !benefitAreaOptions.map(o => o.value).includes(a)).length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Added benefit areas:</p>
              <ul className="list-disc list-inside text-sm">
                {benefitAreas.filter(a => a !== "Other" && !benefitAreaOptions.map(o => o.value).includes(a)).map((a, i) => (
                  <li key={i} className="text-muted-foreground">{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">What benefits do you think tokenization could bring to urban infrastructure management?</h3>
          <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
          
          <div className="grid gap-2">
            {benefitOptions.map((benefit) => (
              <div key={benefit.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={benefit.id} 
                  checked={benefits.includes(benefit.value)}
                  onCheckedChange={(checked) => handleBenefitChange(checked as boolean, benefit.value)}
                />
                <Label htmlFor={benefit.id}>{benefit.label}</Label>
              </div>
            ))}
            
            {benefits.includes("Other") && (
              <div className="flex items-center space-x-2 ml-6 mt-2">
                <Input 
                  value={otherBenefit}
                  onChange={(e) => setOtherBenefit(e.target.value)}
                  placeholder="Specify other benefit"
                  className="w-72"
                />
                <Button size="sm" variant="outline" onClick={handleAddOtherBenefit}>
                  Add
                </Button>
              </div>
            )}
          </div>
          
          {benefits.filter(b => b !== "Other" && !benefitOptions.map(o => o.value).includes(b)).length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Added benefits:</p>
              <ul className="list-disc list-inside text-sm">
                {benefits.filter(b => b !== "Other" && !benefitOptions.map(o => o.value).includes(b)).map((b, i) => (
                  <li key={i} className="text-muted-foreground">{b}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Challenges */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">What do you identify as the main challenges or risks of tokenization in urban infrastructure management?</h3>
          <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
          
          <div className="grid gap-2">
            {challengeOptions.map((challenge) => (
              <div key={challenge.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={challenge.id} 
                  checked={challenges.includes(challenge.value)}
                  onCheckedChange={(checked) => handleChallengeChange(checked as boolean, challenge.value)}
                />
                <Label htmlFor={challenge.id}>{challenge.label}</Label>
              </div>
            ))}
            
            {challenges.includes("Other") && (
              <div className="flex items-center space-x-2 ml-6 mt-2">
                <Input 
                  value={otherChallenge}
                  onChange={(e) => setOtherChallenge(e.target.value)}
                  placeholder="Specify other challenge"
                  className="w-72"
                />
                <Button size="sm" variant="outline" onClick={handleAddOtherChallenge}>
                  Add
                </Button>
              </div>
            )}
          </div>
          
          {challenges.filter(c => c !== "Other" && !challengeOptions.map(o => o.value).includes(c)).length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Added challenges:</p>
              <ul className="list-disc list-inside text-sm">
                {challenges.filter(c => c !== "Other" && !challengeOptions.map(o => o.value).includes(c)).map((c, i) => (
                  <li key={i} className="text-muted-foreground">{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Efficiency */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">To what degree do you think tokenization can enhance operational efficiency in urban infrastructure management?</h3>
          <RadioGroup 
            value={enhanceEfficiency} 
            onValueChange={(value) => updateFormData("tokenization", { enhanceEfficiency: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="To a great extent" id="ee1" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="ee1">To a great extent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="To some extent" id="ee2" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="ee2">To some extent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Neutral" id="ee3" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="ee3">Neutral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="To a little extent" id="ee4" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="ee4">To a little extent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Not at all" id="ee5" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="ee5">Not at all</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Stakeholder Views */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">In your experience, how do stakeholders (e.g., government, private sector, community members) view the role of tokenization in urban infrastructure management?</h3>
          <RadioGroup 
            value={stakeholderViews} 
            onValueChange={(value) => updateFormData("tokenization", { stakeholderViews: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Very positively" id="sv1" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="sv1">Very positively</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Somewhat positively" id="sv2" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="sv2">Somewhat positively</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Neutral" id="sv3" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="sv3">Neutral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Somewhat negatively" id="sv4" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="sv4">Somewhat negatively</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Very negatively" id="sv5" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="sv5">Very negatively</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button onClick={handleContinue}>Continue</Button>
      </CardFooter>
    </Card>
  );
}
