
import { useState } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { SubmissionHeader } from "@/components/admin/SubmissionHeader";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { SubmissionPreviewModal } from "@/components/admin/SubmissionPreviewModal";
import { useSubmissionData } from "@/hooks/useSubmissionData";

const AdminSubmissions = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { 
    filteredSubmissions, 
    filterText, 
    setFilterText, 
    handlePrint, 
    handleDownload,
    loading,
    error
  } = useSubmissionData();

  // Handle login
  const handleLogin = () => {
    setAuthenticated(true);
  };

  // Preview a submission
  const handlePreview = (submission) => {
    setSelectedSubmission(submission);
  };

  // Close the preview
  const handleClosePreview = () => {
    setSelectedSubmission(null);
  };

  if (!authenticated) {
    return <AdminLoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-brand text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Submissions Data</h1>
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-sm bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20 transition-colors">
              Analytics Dashboard
            </a>
            <button 
              onClick={() => setAuthenticated(false)} 
              className="text-sm bg-transparent border border-white text-white px-4 py-2 rounded hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 lg:p-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <SubmissionHeader 
            filterText={filterText}
            onFilterChange={setFilterText}
            onPrint={handlePrint}
            onDownload={handleDownload}
          />
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center p-12 text-red-500">
              <p>Error loading submissions: {error}</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              <p>No submissions found</p>
            </div>
          ) : (
            <SubmissionsTable 
              submissions={filteredSubmissions} 
              onPreview={handlePreview} 
            />
          )}
          
          <SubmissionPreviewModal 
            submission={selectedSubmission} 
            onClose={handleClosePreview} 
          />
        </div>
      </main>
      
      <footer className="bg-gray-100 border-t p-4 text-center text-sm text-gray-600 mt-8 print:hidden">
        <p>© 2025 Urban Infrastructure Research Initiative - Admin Portal</p>
      </footer>

      {/* Print-specific styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: visible;
          }
          #submission-table {
            position: absolute;
            left: 0;
            top: 0;
          }
          @page {
            size: landscape;
          }
        }
      `}} />
    </div>
  );
};

export default AdminSubmissions;