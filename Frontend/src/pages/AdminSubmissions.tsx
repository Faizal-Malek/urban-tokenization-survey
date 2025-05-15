
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SubmissionHeader } from "@/components/admin/SubmissionHeader";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { SubmissionPreviewModal } from "@/components/admin/SubmissionPreviewModal";
import { useSubmissionData } from "@/hooks/useSubmissionData";

const AdminSubmissions = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  // Handle login with database authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://urban-tokenization-survey.onrender.com/api/auth/login",
        { username, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Store the token in localStorage as a backup
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      
      setAuthenticated(true);
      toast.success("Login successful");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed: " + (err.response?.data?.message || "Invalid credentials"));
    }
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#FFF200] flex flex-col">
        {/* Modern Fixed Navigation Bar (no icon) */}
        <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-5xl bg-[#fffbe6]/90 rounded-xl shadow flex items-center justify-between px-8 py-4 border border-yellow-100">
          <span className="font-bold text-xl text-gray-900">Urban Infrastructure Tokenization Survey</span>
          <a href="/" className="bg-white px-5 py-2 rounded-md shadow text-black font-semibold hover:bg-gray-100 transition">
            Back to Main
          </a>
        </nav>
        {/* Centered Login Card */}
        <main className="flex-1 flex items-center justify-center mt-28">
          <div className="bg-white/95 rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Submissions Login</h2>
            <p className="text-gray-600 mb-6">Enter your credentials to access submission data</p>
            <form onSubmit={handleLogin}>
              <label className="block text-gray-800 font-medium mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your username"
              />
              <label className="block text-gray-800 font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your password"
              />
              <button
                type="submit"
                className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 rounded transition"
              >
                Login
              </button>
            </form>
          </div>
        </main>
      </div>
    );
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