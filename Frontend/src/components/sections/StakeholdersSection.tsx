import { useQuestionnaire } from "@/context/QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export function StakeholdersSection() {
  const { formData, updateFormData, setCurrentSection } = useQuestionnaire();
  const { leadStakeholders, collaborationImportance, governanceModels, strategies } = formData.stakeholders;
  
  const [otherStakeholder, setOtherStakeholder] = useState("");
  const [otherModel, setOtherModel] = useState("");
  const [otherStrategy, setOtherStrategy] = useState("");
  
  const stakeholderOptions = [
    { id: "s1", value: "Government agencies", label: "Government agencies" },
    { id: "s2", value: "Private sector companies", label: "Private sector companies" },
    { id: "s3", value: "Community organizations", label: "Community organizations" },
    { id: "s4", value: "Technology providers", label: "Technology providers (e.g., blockchain developers)" },
    { id: "s5", value: "Academic and research institutions", label: "Academic and research institutions" },
    { id: "s6", value: "Other", label: "Other" }
  ];
  
  const modelOptions = [
    { id: "m1", value: "DAOs", label: "Decentralized autonomous organizations (DAOs)" },
    { id: "m2", value: "PPP", label: "Public-private partnerships (PPP)" },
    { id: "m3", value: "Government-led", label: "Government-led initiatives" },
    { id: "m4", value: "Cooperative", label: "Cooperative models (community-driven governance)" },
    { id: "m5", value: "Other", label: "Other" }
  ];
  
  const strategyOptions = [
    { id: "st1", value: "Transparent decision-making", label: "Transparent decision-making processes" },
    { id: "st2", value: "Fair distribution", label: "Fair distribution of tokenized assets and rewards" },
    { id: "st3", value: "Education", label: "Ongoing education and capacity building" },
    { id: "st4", value: "Community engagement", label: "Inclusive community engagement" },
    { id: "st5", value: "Other", label: "Other" }
  ];

  const handleStakeholderChange = (checked: boolean, stakeholder: string) => {
    if (checked) {
      updateFormData("stakeholders", { leadStakeholders: [...leadStakeholders, stakeholder] });
    } else {
      updateFormData("stakeholders", { leadStakeholders: leadStakeholders.filter(s => s !== stakeholder) });
    }
  };
  
  const handleModelChange = (checked: boolean, model: string) => {
    if (checked) {
      updateFormData("stakeholders", { governanceModels: [...governanceModels, model] });
    } else {
      updateFormData("stakeholders", { governanceModels: governanceModels.filter(m => m !== model) });
    }
  };
  
  const handleStrategyChange = (checked: boolean, strategy: string) => {
    if (checked) {
      updateFormData("stakeholders", { strategies: [...strategies, strategy] });
    } else {
      updateFormData("stakeholders", { strategies: strategies.filter(s => s !== strategy) });
    }
  };
  
  const handleAddOtherStakeholder = () => {
    if (otherStakeholder.trim() && !leadStakeholders.includes(otherStakeholder)) {
      updateFormData("stakeholders", { leadStakeholders: [...leadStakeholders, otherStakeholder] });
      setOtherStakeholder("");
      toast.success("Custom stakeholder added!");
    } else {
      toast.error("Please enter a unique stakeholder");
    }
  };
  
  const handleAddOtherModel = () => {
    if (otherModel.trim() && !governanceModels.includes(otherModel)) {
      updateFormData("stakeholders", { governanceModels: [...governanceModels, otherModel] });
      setOtherModel("");
      toast.success("Custom governance model added!");
    } else {
      toast.error("Please enter a unique governance model");
    }
  };
  
  const handleAddOtherStrategy = () => {
    if (otherStrategy.trim() && !strategies.includes(otherStrategy)) {
      updateFormData("stakeholders", { strategies: [...strategies, otherStrategy] });
      setOtherStrategy("");
      toast.success("Custom strategy added!");
    } else {
      toast.error("Please enter a unique strategy");
    }
  };

  const handleContinue = () => {
    if (leadStakeholders.length === 0 || !collaborationImportance || governanceModels.length === 0 || strategies.length === 0) {
      toast.error("Please complete all fields before continuing.");
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentSection("future");
    toast.success("Stakeholder information saved! Moving to Future Outlook section.");
  };

  const handleBack = () => {
    setCurrentSection("tokenization");
  };

  return (
    <Card className="w-full relative bg-white opacity-90 before:bg-[url('/jhbStreets.png')] before:absolute before:inset-0 before:opacity-[0.1] before:z-[-1] text-black">

      <CardHeader>
        <CardTitle>Section E: Stakeholder Roles and Governance</CardTitle>
        <CardDescription>
          Help us understand your perspectives on stakeholder roles and governance models for tokenized urban infrastructure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lead Stakeholders */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Which stakeholders should take the lead in implementing tokenization in urban infrastructure management?</h3>
          <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
          
          <div className="grid gap-2">
            {stakeholderOptions.map((stakeholder) => (
              <div key={stakeholder.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={stakeholder.id} 
                  checked={leadStakeholders.includes(stakeholder.value)}
                  onCheckedChange={(checked) => handleStakeholderChange(checked as boolean, stakeholder.value)}
                />
                <Label htmlFor={stakeholder.id}>{stakeholder.label}</Label>
              </div>
            ))}
            
            {leadStakeholders.includes("Other") && (
              <div className="flex items-center space-x-2 ml-6 mt-2">
                <Input 
                  value={otherStakeholder}
                  onChange={(e) => setOtherStakeholder(e.target.value)}
                  placeholder="Specify other stakeholder"
                  className="w-72"
                />
                <Button size="sm" variant="outline" onClick={handleAddOtherStakeholder}>
                  Add
                </Button>
              </div>
            )}
          </div>
          
          {leadStakeholders.filter(s => s !== "Other" && !stakeholderOptions.map(o => o.value).includes(s)).length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Added stakeholders:</p>
              <ul className="list-disc list-inside text-sm">
                {leadStakeholders.filter(s => s !== "Other" && !stakeholderOptions.map(o => o.value).includes(s)).map((s, i) => (
                  <li key={i} className="text-muted-foreground">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Collaboration Importance */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">How essential is collaboration among different stakeholders for the successful implementation of tokenization in urban infrastructure?</h3>
          <RadioGroup 
            value={collaborationImportance} 
            onValueChange={(value) => updateFormData("stakeholders", { collaborationImportance: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Extremely important" id="ci1" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="ci1">Extremely important</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Important" id="ci2" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="ci2">Important</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Neutral" id="ci3" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="ci3">Neutral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Not important" id="ci4" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="ci4">Not important</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Not important at all" id="ci5" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="ci5">Not important at all</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Governance Models */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">What governance models do you believe would be most effective for integrating tokenization into urban infrastructure systems?</h3>
          <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
          
          <div className="grid gap-2">
            {modelOptions.map((model) => (
              <div key={model.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={model.id} 
                  checked={governanceModels.includes(model.value)}
                  onCheckedChange={(checked) => handleModelChange(checked as boolean, model.value)}
                />
                <Label htmlFor={model.id}>{model.label}</Label>
              </div>
            ))}
            
            {governanceModels.includes("Other") && (
              <div className="flex items-center space-x-2 ml-6 mt-2">
                <Input 
                  value={otherModel}
                  onChange={(e) => setOtherModel(e.target.value)}
                  placeholder="Specify other governance model"
                  className="w-72"
                />
                <Button size="sm" variant="outline" onClick={handleAddOtherModel}>
                  Add
                </Button>
              </div>
            )}
          </div>
          
          {governanceModels.filter(m => m !== "Other" && !modelOptions.map(o => o.value).includes(m)).length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Added governance models:</p>
              <ul className="list-disc list-inside text-sm">
                {governanceModels.filter(m => m !== "Other" && !modelOptions.map(o => o.value).includes(m)).map((m, i) => (
                  <li key={i} className="text-muted-foreground">{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Strategies */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">What strategies do you think are necessary to ensure fair participation and benefits for all stakeholders in tokenized urban infrastructure systems?</h3>
          <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
          
          <div className="grid gap-2">
            {strategyOptions.map((strategy) => (
              <div key={strategy.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={strategy.id} 
                  checked={strategies.includes(strategy.value)}
                  onCheckedChange={(checked) => handleStrategyChange(checked as boolean, strategy.value)}
                />
                <Label htmlFor={strategy.id}>{strategy.label}</Label>
              </div>
            ))}
            
            {strategies.includes("Other") && (
              <div className="flex items-center space-x-2 ml-6 mt-2">
                <Input 
                  value={otherStrategy}
                  onChange={(e) => setOtherStrategy(e.target.value)}
                  placeholder="Specify other strategy"
                  className="w-72"
                />
                <Button size="sm" variant="outline" onClick={handleAddOtherStrategy}>
                  Add
                </Button>
              </div>
            )}
          </div>
          
          {strategies.filter(s => s !== "Other" && !strategyOptions.map(o => o.value).includes(s)).length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Added strategies:</p>
              <ul className="list-disc list-inside text-sm">
                {strategies.filter(s => s !== "Other" && !strategyOptions.map(o => o.value).includes(s)).map((s, i) => (
                  <li key={i} className="text-muted-foreground">{s}</li>
                ))}
              </ul>
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
