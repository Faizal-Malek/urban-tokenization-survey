import { useState, useEffect } from "react";
import { checkAuthStatus } from "@/utils/auth";
import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import axios from "axios";
import { toast } from "sonner";

// Chart colors
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(checkAuthStatus());
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    if (authenticated) {
      // Get token from localStorage as a backup if cookie doesn't work
      const token = localStorage.getItem('token');
      
      axios.get("https://urban-tokenization-survey.onrender.com/api/questionnaire/analytics", { 
        withCredentials: true,
        headers: {
          // Include token in Authorization header as a backup
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      })
        .then(res => setDashboardData(res.data))
        .catch(err => {
          console.error("Analytics error:", err);
          toast.error("Failed to load analytics: " + (err.response?.data?.message || "Unknown error"));
        });
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <AdminLoginForm 
        onLoginSuccess={() => setAuthenticated(true)}
        title="Admin Dashboard Login"
        description="Enter your credentials to access questionnaire analytics"
      />
    );
  }

  if (!dashboardData) {
    return <div className="min-h-screen flex items-center justify-center">Loading analytics...</div>;
  }

  // Rest of your component remains the same, but replace the navigation bar with:
  return (
    <div className="bg-gradient-to-br from-black via-black to-[#FFF200] min-h-screen">
      <AdminNavBar currentPage="dashboard" />
      {/* Rest of your dashboard UI */}
    </div>
  );
};

export default AdminDashboard;
