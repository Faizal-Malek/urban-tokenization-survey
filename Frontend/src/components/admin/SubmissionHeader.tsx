
import { FilterIcon, PrinterIcon, DownloadIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmissionHeaderProps {
  filterText: string;
  onFilterChange: (value: string) => void;
  onPrint: () => void;
  onDownload: () => void;
}

export const SubmissionHeader = ({ 
  filterText, 
  onFilterChange, 
  onPrint, 
  onDownload 
}: SubmissionHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h2 className="text-xl font-bold">Questionnaire Submissions</h2>
      
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search filter */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search submissions..."
            value={filterText}
            onChange={(e) => onFilterChange(e.target.value)}
            className="pl-9 pr-4 py-2 border rounded-md w-full sm:w-64"
          />
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4" />
          Filter
        </Button>
        
        <Button onClick={onPrint} variant="outline" className="flex items-center gap-2">
          <PrinterIcon className="w-4 h-4" />
          Print
        </Button>
        
        <Button onClick={onDownload} className="flex items-center gap-2">
          <DownloadIcon className="w-4 h-4" />
          Download CSV
        </Button>
      </div>
    </div>
  );
};