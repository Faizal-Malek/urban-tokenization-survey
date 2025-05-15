
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Submission = {
  id: string;
  date: string;
  occupation: string;
  educationLevel: string;
  yearsOfExperience: string;
  blockchainFamiliarity: string;
  participatedProjects: string;
  adoptionLikelihood: string;
  stakeholderViews: string;
  [key: string]: string;
};

interface SubmissionPreviewModalProps {
  submission: Submission | null;
  onClose: () => void;
}

export const SubmissionPreviewModal = ({ submission, onClose }: SubmissionPreviewModalProps) => {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Submission Details - {submission.id}</h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close preview"
            >
              &times;
            </button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {Object.entries(submission).map(([key, value]) => (
              <div key={key} className="border-b pb-2">
                <dt className="text-sm font-medium text-gray-500">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};