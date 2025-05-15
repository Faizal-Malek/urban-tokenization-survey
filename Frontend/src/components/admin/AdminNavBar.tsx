import { logoutAdmin, getAdminUsername } from "@/utils/auth";

interface AdminNavBarProps {
  currentPage: 'dashboard' | 'submissions';
}

export const AdminNavBar = ({ currentPage }: AdminNavBarProps) => {
  const username = getAdminUsername();
  
  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-5xl bg-black text-white rounded-xl shadow flex items-center justify-between px-8 py-4">
      <div className="flex items-center">
        <span className="font-bold text-xl">Admin Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="mr-4">Welcome, {username}</span>
        <a 
          href="/admin/submissions" 
          className={`px-4 py-2 rounded-md shadow font-semibold transition ${currentPage === 'submissions' ? 'bg-yellow-400 text-black' : 'bg-white text-black hover:bg-gray-100'}`}
        >
          Submissions Data
        </a>
        <a 
          href="/admin" 
          className={`px-4 py-2 rounded-md shadow font-semibold transition ${currentPage === 'dashboard' ? 'bg-yellow-400 text-black' : 'bg-white text-black hover:bg-gray-100'}`}
        >
          Dashboard
        </a>
        <button 
          onClick={logoutAdmin} 
          className="bg-transparent border border-white px-4 py-2 rounded-md text-white font-semibold hover:bg-white/10 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};