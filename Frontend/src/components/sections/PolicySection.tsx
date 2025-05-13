import { useQuestionnaire } from "@/context/QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export function PolicySection() {
  const { formData, updateFormData, setCurrentSection } = useQuestionnaire();
  const { currentPoliciesPromote, challenges, governmentSupport } = formData.policy;
  const [otherChallenge, setOtherChallenge] = useState("");
  
  const challengeOptions = [
    { id: "c1", value: "Lack of clear legal frameworks", label: "Lack of clear legal frameworks" },
    { id: "c2", value: "Uncertainty in tax implications", label: "Uncertainty in tax implications" },
    { id: "c3", value: "Resistance from traditional institutions", label: "Resistance from traditional institutions" },
    { id: "c4", value: "Privacy and security concerns", label: "Privacy and security concerns" },
    { id: "c5", value: "Other", label: "Other" }
  ];

  const handleChallengeChange = (checked: boolean, challenge: string) => {
    if (checked) {
      updateFormData("policy", { challenges: [...challenges, challenge] });
    } else {
      updateFormData("policy", { challenges: challenges.filter(c => c !== challenge) });
    }
  };

  const handleAddOtherChallenge = () => {
    if (otherChallenge.trim() && !challenges.includes(otherChallenge)) {
      updateFormData("policy", { challenges: [...challenges, otherChallenge] });
      setOtherChallenge("");
      toast.success("Custom challenge added!");
    } else {
      toast.error("Please enter a unique challenge");
    }
  };

  const handleContinue = () => {
    if (!currentPoliciesPromote || challenges.length === 0 || !governmentSupport) {
      toast.error("Please complete all fields before continuing.");
      return;
    }
    setCurrentSection("tokenization");
    toast.success("Policy information saved! Moving to Tokenization section.");
  };

  const handleBack = () => {
    setCurrentSection("knowledge");
  };

  return (
    <Card className="w-full relative bg-white opacity-90 before:bg-[url('/jhbStreets.png')] before:absolute before:inset-0 before:opacity-[0.1] before:z-[-1] text-black">

      <CardHeader>
        <CardTitle>Section C: Policy and Regulatory Environment</CardTitle>
        <CardDescription>
          Share your perspectives on current policies and regulations affecting blockchain and tokenization in urban infrastructure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Policies */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Do you believe that current urban infrastructure policies in your area promote the use of blockchain and tokenization?</h3>
          <RadioGroup 
            value={currentPoliciesPromote} 
            onValueChange={(value) => updateFormData("policy", { currentPoliciesPromote: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Strongly agree" id="cp1" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="cp1">Strongly agree</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Agree" id="cp2" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="cp2">Agree</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Neutral" id="cp3" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="cp3">Neutral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Disagree" id="cp4" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="cp4">Disagree</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Strongly disagree" id="cp5" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="cp5">Strongly disagree</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Challenges */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">What challenges do you perceive in the existing policy or regulatory framework regarding the implementation of tokenization in urban infrastructure management?</h3>
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

        {/* Government Support */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">How crucial do you think government support is for enabling blockchain and tokenization in urban infrastructure projects?</h3>
          <RadioGroup 
            value={governmentSupport} 
            onValueChange={(value) => updateFormData("policy", { governmentSupport: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Very important" id="gs1" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="gs1">Very important</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Important" id="gs2" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="gs2">Important</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Neutral" id="gs3" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="gs3">Neutral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Not important" id="gs4" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="gs4">Not important</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Not important at all" id="gs5" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="gs5">Not important at all</Label>
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
