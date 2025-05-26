
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { QuestionnaireProvider } from "./context/QuestionnaireContext";
import QuestionnaireHome from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import EnhancedAdminDashboard from "./pages/EnhancedAdminDashboard";
import AdminSubmissions from "./pages/AdminSubmissions";
import TermsAndConditions from "./pages/TermsAndConditions";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const termsAccepted = localStorage.getItem("termsAccepted") === "true";
  
  if (!termsAccepted) {
    return <Navigate to="/terms" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <QuestionnaireProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <QuestionnaireHome />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<EnhancedAdminDashboard />} />
            <Route path="/admin/legacy" element={<AdminDashboard />} />
            <Route path="/admin/submissions" element={<AdminSubmissions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QuestionnaireProvider>
  </QueryClientProvider>
);

export default App;
