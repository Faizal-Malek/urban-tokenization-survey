import { logoutAdmin, getAdminUsername, getSessionInfo } from "@/utils/auth";
import { useState } from "react";
import { LogOut, User, Clock } from "lucide-react";

interface AdminNavBarProps {
  currentPage: 'dashboard' | 'submissions';
}

export const AdminNavBar = ({ currentPage }: AdminNavBarProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const username = getAdminUsername();
  const sessionInfo = getSessionInfo();
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAdmin();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };
  
  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-6xl bg-black text-white rounded-xl shadow flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl">Admin Dashboard</span>
        <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
          <Clock className="h-4 w-4" />
          <span>
            Session: {sessionInfo.loginTime ? 
              `${sessionInfo.loginTime.toLocaleTimeString()}` : 
              'Active'
            }
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 text-sm text-white/80">
          <User className="h-4 w-4" />
          <span>Welcome, {username}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <a 
            href="/admin/submissions" 
            className={`px-4 py-2 rounded-md shadow font-semibold transition ${
              currentPage === 'submissions' 
                ? 'bg-yellow-400 text-black' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Submissions
          </a>
          <a 
            href="/admin" 
            className={`px-4 py-2 rounded-md shadow font-semibold transition ${
              currentPage === 'dashboard' 
                ? 'bg-yellow-400 text-black' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Dashboard
          </a>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 px-4 py-2 rounded-md text-white font-semibold transition flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
};