import { logoutAdmin, getAdminUsername, getSessionInfo } from "@/utils/auth";
import { useState } from "react";
import { LogOut, User, Clock, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdminNavBarProps {
  currentPage: 'dashboard' | 'submissions';
}

export const AdminNavBar = ({ currentPage }: AdminNavBarProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
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
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-6xl bg-black text-white rounded-xl shadow flex items-center justify-between px-4 sm:px-8 py-4">
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
      
      {isMobile ? (
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2 text-white hover:bg-gray-800 rounded-md">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-900 text-white border-gray-800 w-[80vw]">
            <SheetHeader>
              <SheetTitle className="text-white">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-white/80 pb-4 border-b border-gray-800">
                <User className="h-4 w-4" />
                <span>Welcome, {username}</span>
              </div>
              
              <div className="flex flex-col gap-3 py-4">
                <a 
                  href="/admin/submissions" 
                  className={`px-4 py-3 rounded-md shadow font-semibold transition ${
                    currentPage === 'submissions' 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Submissions
                </a>
                <a 
                  href="/admin" 
                  className={`px-4 py-3 rounded-md shadow font-semibold transition ${
                    currentPage === 'dashboard' 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </a>
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 px-4 py-3 rounded-md text-white font-semibold transition flex items-center gap-2 justify-center mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-sm text-white/80">
            <User className="h-4 w-4" />
            <span>Welcome, {username}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href="/admin/submissions" 
              className={`px-2 py-2 rounded-md shadow font-semibold transition text-xs sm:text-sm sm:px-4 whitespace-nowrap ${
                currentPage === 'submissions' 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {isMobile ? "Subs" : "Submissions"}
            </a>
            <a 
              href="/admin" 
              className={`px-2 py-2 rounded-md shadow font-semibold transition text-xs sm:text-sm sm:px-4 whitespace-nowrap ${
                currentPage === 'dashboard' 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {isMobile ? "Dash" : "Dashboard"}
            </a>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 px-2 py-2 rounded-md text-white font-semibold transition flex items-center gap-1 text-xs sm:text-sm sm:px-4 sm:gap-2 whitespace-nowrap"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              {isLoggingOut ? (isMobile ? 'Exit...' : 'Logging out...') : (isMobile ? 'Exit' : 'Logout')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};