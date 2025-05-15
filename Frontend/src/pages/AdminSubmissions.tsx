
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SubmissionHeader } from "@/components/admin/SubmissionHeader";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { SubmissionPreviewModal } from "@/components/admin/SubmissionPreviewModal";
import { useSubmissionData } from "@/hooks/useSubmissionData";
import { checkAuthStatus } from "@/utils/auth";
import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

const AdminSubmissions = () => {
  const [authenticated, setAuthenticated] = useState(checkAuthStatus());
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

  // Preview a submission
  const handlePreview = (submission) => {
    setSelectedSubmission(submission);
  };

  // Close the preview
  const handleClosePreview = () => {
    setSelectedSubmission(null);
  };

  if (!authenticated) {
    return (
      <AdminLoginForm 
        onLoginSuccess={() => setAuthenticated(true)}
        title="Admin Submissions Login"
        description="Enter your credentials to access submission data"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#FFF200] flex flex-col">
      <AdminNavBar currentPage="submissions" />
      
      <main className="container mx-auto p-4 lg:p-8 mt-28">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <SubmissionHeader 
            filterText={filterText} 
            setFilterText={setFilterText} 
            handlePrint={handlePrint} 
            handleDownload={handleDownload} 
          />
          
          {loading ? (
            <div className="text-center py-8">Loading submissions...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error loading submissions: {error}</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8">No submissions found</div>
          ) : (
            <SubmissionsTable 
              submissions={filteredSubmissions} 
              onPreview={handlePreview} 
            />
          )}
        </div>
      </main>
      
      {selectedSubmission && (
        <SubmissionPreviewModal 
          submission={selectedSubmission} 
          onClose={handleClosePreview} 
        />
      )}
    </div>
  );
};

export default AdminSubmissions;