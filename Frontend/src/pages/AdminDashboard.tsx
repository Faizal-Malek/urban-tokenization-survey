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

  return (
    <div className="bg-gradient-to-br from-black via-black to-[#FFF200] min-h-screen pb-16">
      <AdminNavBar currentPage="dashboard" />
      
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Survey Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Demographics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Demographics</CardTitle>
              <CardDescription>Breakdown of respondent demographics</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData?.demographics || []}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData?.demographics?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Knowledge Level Card */}
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Levels</CardTitle>
              <CardDescription>Blockchain & tokenization familiarity</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData?.knowledge || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Additional charts can be added here */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Adoption Likelihood</CardTitle>
              <CardDescription>Likelihood of adopting tokenization solutions</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData?.adoption || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
