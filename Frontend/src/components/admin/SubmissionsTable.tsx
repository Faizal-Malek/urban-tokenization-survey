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
  email: string;
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

export const SubmissionsTable = ({
  submissions,
  onPreview
}: SubmissionsTableProps) => {
  return (
    <div className="spreadsheet-view border border-gray-200 rounded-md overflow-hidden mb-6">
      <div
        className="overflow-x-auto print:overflow-visible"
        id="submission-table"
      >
        <Table>
          <TableCaption>
            <div className="flex items-center justify-center gap-2 text-black">
              <FileSpreadsheetIcon className="w-5 h-5" />
              <span>Total submissions: {submissions.length}</span>
            </div>
          </TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[80px] text-black">ID</TableHead>
              <TableHead className="w-[120px] text-black">Date</TableHead>
              <TableHead className="w-[220px] text-black">Email</TableHead>
              <TableHead className="text-black">Occupation</TableHead>
              <TableHead className="text-black">Education Level</TableHead>
              <TableHead className="text-black">Experience</TableHead>
              <TableHead className="text-black">
                Blockchain Familiarity
              </TableHead>
              <TableHead className="text-black">Project Experience</TableHead>
              <TableHead className="text-black">Adoption Likelihood</TableHead>
              <TableHead className="text-black">Stakeholder Views</TableHead>
              <TableHead className="w-[80px] text-black">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow
                key={submission.id}
                className="border-b hover:bg-gray-50"
              >
                <TableCell className="font-medium text-black">
                  {submission.id}
                </TableCell>
                <TableCell className="text-black">{submission.date}</TableCell>
                <TableCell className="text-black">{submission.email}</TableCell>
                <TableCell className="text-black">
                  {submission.occupation}
                </TableCell>
                <TableCell className="text-black">
                  {submission.educationLevel}
                </TableCell>
                <TableCell className="text-black">
                  {submission.yearsOfExperience}
                </TableCell>
                <TableCell className="text-black">
                  {submission.blockchainFamiliarity}
                </TableCell>
                <TableCell className="text-black">
                  {submission.participatedProjects}
                </TableCell>
                <TableCell className="text-black">
                  {submission.adoptionLikelihood}
                </TableCell>
                <TableCell className="text-black">
                  {submission.stakeholderViews}
                </TableCell>
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
