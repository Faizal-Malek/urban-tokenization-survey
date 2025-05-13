import { useQuestionnaire } from "@/context/QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function FutureSection() {
  const { formData, updateFormData, setCurrentSection, submitForm, isSubmitting } = useQuestionnaire();
  const { adoptionLikelihood, factorsText, futureVisionText, contactInfo } = formData.future;

  const handleSubmit = async () => {
    if (!adoptionLikelihood || !factorsText || !futureVisionText) {
      toast.error("Please complete all required fields before submitting.");
      return;
    }
    
    toast.info("Submitting your questionnaire...");
    
    try {
      await submitForm();
      // Redirect happens in submitForm function
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    }
  };

  const handleBack = () => {
    setCurrentSection("stakeholders");
  };

  return (
    <Card className="w-full relative bg-white opacity-90 before:bg-[url('/jhbStreets.png')] before:absolute before:inset-0 before:opacity-[0.1] before:z-[-1] text-black">

      <CardHeader>
        <CardTitle>Section F: Future Outlook</CardTitle>
        <CardDescription>
          Share your thoughts on the future of tokenization in urban infrastructure management.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Adoption Likelihood */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">How likely do you think it is that tokenization will be broadly adopted in urban infrastructure management over the next 5-10 years?</h3>
          <RadioGroup 
            value={adoptionLikelihood} 
            onValueChange={(value) => updateFormData("future", { adoptionLikelihood: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Very likely" id="al1" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="al1">Very likely</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Likely" id="al2" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="al2">Likely</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Neutral" id="al3" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="al3">Neutral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Unlikely" id="al4" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="al4">Unlikely</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Very unlikely" id="al5" className="border-black text-black checked:bg-black checked:border-black" />
              <Label htmlFor="al5">Very unlikely</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Primary Factors */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">What do you regard as the primary factors that will promote or impede the use of tokenization in urban infrastructure?</h3>
          <Textarea 
            value={factorsText}
            onChange={(e) => updateFormData("future", { factorsText: e.target.value })}
            placeholder="Please share your thoughts..."
            className="min-h-28"
          />
        </div>

        {/* Future Vision */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">How do you picture the future of urban infrastructure management in a scenario where tokenization is fully integrated?</h3>
          <Textarea 
            value={futureVisionText}
            onChange={(e) => updateFormData("future", { futureVisionText: e.target.value })}
            placeholder="Please describe your vision..."
            className="min-h-28"
          />
        </div>

        {/* Contact Info (Optional) */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Contact Information (Optional)</h3>
          <p className="text-sm text-muted-foreground mb-2">
            If you wish to receive updates on this study, please provide your contact information.
          </p>
          <Input 
            value={contactInfo}
            onChange={(e) => updateFormData("future", { contactInfo: e.target.value })}
            placeholder="Email or phone number"
            className="max-w-md"
          />
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Thank you for your participation! Your feedback is invaluable for understanding the potential impact of tokenization on urban infrastructure management. All responses will remain confidential and are intended solely for research purposes.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-brand hover:bg-brand-dark"
        >
          {isSubmitting ? "Submitting..." : "Submit Questionnaire"}
        </Button>
      </CardFooter>
    </Card>
  );
}
