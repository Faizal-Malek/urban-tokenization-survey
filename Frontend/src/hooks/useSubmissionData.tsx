
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type Submission = {
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

export const useSubmissionData = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");
  const { toast } = useToast();

  // Fetch submissions from the API
  // In the useEffect where you fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage as a backup if cookie doesn't work
        const token = localStorage.getItem('token');
        
        const response = await fetch('https://urban-tokenization-survey.onrender.com/api/admin/questionnaires', {
          credentials: 'include',  // This is important for cookies
          headers: {
            'Content-Type': 'application/json',
            // Include token in Authorization header as a backup
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the data to match our Submission type
        const formattedSubmissions = data.submissions.map((item: any, index: number) => {
          const responses = item.responses || {};
          const demographics = responses.demographics || {};
          const knowledge = responses.knowledge || {};
          const future = responses.future || {};
          const stakeholders = responses.stakeholders || {};
          
          return {
            id: item._id || `S${String(index + 1).padStart(3, '0')}`,
            date: item.submittedAt ? new Date(item.submittedAt).toISOString().split('T')[0] : 'Unknown',
            occupation: demographics.occupation || responses.occupation || 'Not specified',
            educationLevel: demographics.educationLevel || responses.educationLevel || 'Not specified',
            yearsOfExperience: demographics.yearsOfExperience || responses.yearsOfExperience || 'Not specified',
            blockchainFamiliarity: knowledge.blockchainFamiliarity || responses.blockchainFamiliarity || 'Not specified',
            participatedProjects: responses.participatedProjects || 'No',
            adoptionLikelihood: future.adoptionLikelihood || responses.adoptionLikelihood || 'Not specified',
            stakeholderViews: stakeholders.stakeholderViews || responses.stakeholderViews || 'Not specified',
          };
        });
        
        setSubmissions(formattedSubmissions);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        toast({
          title: "Error fetching submissions",
          description: err instanceof Error ? err.message : 'Failed to load data',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubmissions();
  }, [toast]);

  // Function to handle print action
  const handlePrint = () => {
    toast({
      title: "Printing submissions",
      description: "Sending data to printer...",
    });
    window.print();
  };

  // Function to handle download as CSV
  const handleDownload = () => {
    if (submissions.length === 0) {
      toast({
        title: "No data to download",
        description: "There are no submissions to export",
        variant: "destructive"
      });
      return;
    }
    
    // Generate CSV content
    const headers = Object.keys(submissions[0]).join(',');
    const rows = submissions.map(submission => 
      Object.values(submission).join(',')
    ).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Submissions are being downloaded as CSV",
    });
  };

  // Filter submissions based on search text
  const filteredSubmissions = filterText 
    ? submissions.filter(submission => 
        Object.values(submission).some(value => 
          value.toString().toLowerCase().includes(filterText.toLowerCase())
        )
      )
    : submissions;

  return {
    submissions,
    filteredSubmissions,
    filterText,
    setFilterText,
    handlePrint,
    handleDownload,
    loading,
    error
  };
};