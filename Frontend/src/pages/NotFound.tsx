
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-[#333300]">
      <div className="text-center bg-black/90 border border-brand-yellow/20 p-8 rounded-lg shadow-lg backdrop-blur-sm">
        <h1 className="text-6xl font-bold mb-4 text-brand-yellow">404</h1>
        <p className="text-xl text-white mb-8">Oops! Page not found</p>
        <p className="max-w-md mx-auto text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild className="bg-brand-yellow hover:bg-brand-yellow/80 text-black font-semibold">
          <a href="/">Return to Questionnaire</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
