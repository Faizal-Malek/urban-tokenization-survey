
import { EyeIcon } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileSpreadsheetIcon } from "lucide-react";

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
};

interface SubmissionsTableProps {
  submissions: Submission[];
  onPreview: (submission: Submission) => void;
}

export const SubmissionsTable = ({ submissions, onPreview }: SubmissionsTableProps) => {
  return (
    <div className="spreadsheet-view border border-gray-200 rounded-md overflow-hidden mb-6">
      <div className="overflow-x-auto print:overflow-visible" id="submission-table">
        <Table>
          <TableCaption>
            <div className="flex items-center justify-center gap-2">
              <FileSpreadsheetIcon className="w-5 h-5" />
              <span>Total submissions: {submissions.length}</span>
            </div>
          </TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Occupation</TableHead>
              <TableHead>Education Level</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Blockchain Familiarity</TableHead>
              <TableHead>Project Experience</TableHead>
              <TableHead>Adoption Likelihood</TableHead>
              <TableHead>Stakeholder Views</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id} className="border-b hover:bg-gray-50">
                <TableCell className="font-medium">{submission.id}</TableCell>
                <TableCell>{submission.date}</TableCell>
                <TableCell>{submission.occupation}</TableCell>
                <TableCell>{submission.educationLevel}</TableCell>
                <TableCell>{submission.yearsOfExperience}</TableCell>
                <TableCell>{submission.blockchainFamiliarity}</TableCell>
                <TableCell>{submission.participatedProjects}</TableCell>
                <TableCell>{submission.adoptionLikelihood}</TableCell>
                <TableCell>{submission.stakeholderViews}</TableCell>
                <TableCell>
                  <button 
                    onClick={() => onPreview(submission)} 
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Preview submission"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};