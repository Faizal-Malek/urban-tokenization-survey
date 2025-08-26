import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const TermsAndConditions = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAccept = () => {
    if (accepted) {
      localStorage.setItem("termsAccepted", "true");
      navigate("/");
      toast({
        title: "Invitation Accepted",
        description: "You can now proceed with the questionnaire."
      });
    } else {
      toast({
        title: "Agreement Required",
        description:
          "Please accept the invitation and complete all signature checkboxes to proceed.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black text-white p-4 shadow-md border-b border-brand-yellow/30">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-yellow">
            Urban Infrastructure Tokenization Survey
          </h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 bg-gradient-to-br from-black via-black to-[#333300]">
        <div className="max-w-4xl mx-auto bg-black/70 p-6 rounded-lg border border-brand-yellow/20 shadow-lg">
          <div className="flex justify-center mb-6">
            <img
              src="/e411e33e-dbda-4cec-bf68-b143fe60ec8f.png"
              alt="University of Johannesburg Emblem"
              className="h-24 md:h-32"
            />
          </div>

          <h2 className="text-2xl font-bold mb-6 text-brand-yellow text-center uppercase">
            Invitation
          </h2>

          <div className="overflow-y-auto max-h-[60vh] p-4 bg-black border border-brand-yellow/10 rounded-md mb-6 text-brand-yellow/90">
            <h3 className="text-xl font-semibold mb-4 text-brand-yellow">
              Invitation letter
            </h3>

            <p className="mb-4">Dear Potential Participant,</p>

            <p className="mb-4">
              I am currently pursuing a Master’s degree at the School of
              Engineering and Built Environments at the University of
              Johannesburg. As part of my research project titled "Tokenization
              for Sustainable Urban Infrastructure: Advancing Decentralized
              Management in Bryanston, South Africa," I would like to invite you
              to take part in an online questionnaire.
            </p>

            <p className="mb-4">
              Tokenization refers to the process of converting ownership or
              rights to a real-world asset—such as property, infrastructure, or
              services—into digital tokens on a blockchain. These tokens can be
              easily divided, traded, or managed, enabling greater transparency,
              accessibility, and efficiency in asset management and investment.
            </p>

            <p className="mb-4">
              This questionnaire, which will be available from August the 10 2025
              to August the 30, 2025, will take about 15-20 minutes to complete
              and utilizes a 5-point Likert-type scale, using an online google
              doc questionnaire form. Its purpose is to identify the challenges
              and opportunities associated with implementing tokenization in the
              management of urban infrastructure.
            </p>

            <p className="mb-4">
              Participation is completely voluntary, and you can opt out of the
              study at any time without any negative consequences. If you decide
              to withdraw, any information provided by you will be discarded
              from the study.
            </p>

            <p className="mb-4">
              Rest assured that no personal or company information will be
              collected during this process. Your responses will be kept
              confidential and will only be used for research purposes. While
              there are no immediate benefits for you, your input will help
              advance sustainable urban infrastructure in South Africa.
            </p>

            <p className="mb-4">
              By completing the questionnaire, you indicate your voluntary
              agreement to participate in this research under the specified
              terms.
            </p>

            <p className="mb-4">
              Thank you for considering being part of this study. Your
              involvement is highly valued.
            </p>

            <p className="mb-6">
              Best regards,
              <br />
              Naeem Razak
              <br />
              Master’s Candidate – University of Johannesburg
            </p>

            <p className="text-center mb-6">
              Thank you for taking the time to participate in this
              questionnaire.
            </p>

            <p className="mb-4">
              For any questions, concerns, or additional information, please
              contact the below:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Researcher:</strong> Naeem Razak
                </p>
                <p>
                  <strong>Email:</strong> Naeemrazak96@gmail.com
                </p>
                <p>
                  <strong>Phone:</strong> 061 810 9145
                </p>
              </div>
              <div>
                <p>
                  <strong>Supervisor:</strong> Prof Trynos Gumbo
                </p>
                <p>
                  <strong>Email:</strong> tgumbo@uj.ac.za
                </p>
                <p>
                  <strong>Phone:</strong> 011 559 6318
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
              className="border-brand-yellow data-[state=checked]:bg-brand-yellow data-[state=checked]:text-black"
            />
            <Label htmlFor="terms" className="text-brand-yellow cursor-pointer">
              I have read and agree to participate in this research under the
              specified terms
            </Label>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleAccept}
              className="bg-gradient-to-r from-brand-yellow to-amber-600 text-black hover:opacity-90 transition-opacity"
            >
              Proceed to Questionnaire
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-black border-t border-brand-yellow/20 p-4 text-center text-sm text-brand-yellow">
        <p>© 2025 Urban Infrastructure Research Initiative</p>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
