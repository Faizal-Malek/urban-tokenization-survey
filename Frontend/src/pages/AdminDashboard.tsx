import { useState, useEffect, useCallback } from "react";
import { checkAuthStatus, verifyAuthStatus, isLocallyAuthenticated } from "@/utils/auth";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar
} from "recharts";
import axios from "axios";
import { toast } from "sonner";
import { 
  RefreshCw, 
  Download, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  AlertCircle,
  FileText,
  Calendar
} from "lucide-react";

// Enhanced chart color schemes
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff7c7c'];
const GRADIENT_COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
const PROFESSIONAL_COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'];

// Custom tooltip component for better data display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} ${entry.name === 'Percentage' ? '%' : 'responses'}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    if (!authenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      console.log("Fetching analytics with token:", token ? "Present" : "Missing");
      console.log("Current URL:", window.location.href);
      
      let response;
      
      try {
        // First attempt with credentials
        response = await axios.get("https://urban-tokenization-survey.onrender.com/api/questionnaire/analytics", { 
          withCredentials: true,
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        });
      } catch (firstError: any) {
        console.warn("First attempt failed, trying without credentials:", firstError.message);
        
        // Second attempt without credentials (for CORS issues)
        response = await axios.get("https://urban-tokenization-survey.onrender.com/api/questionnaire/analytics", { 
          headers: {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        });
      }
      
      console.log("Analytics data structure:", JSON.stringify(response.data, null, 2));
      
      // Enhanced data validation and processing
      const processedData = {
        ...response.data,
        // Ensure all chart data arrays exist and have proper structure
        demographics: Array.isArray(response.data.demographics) ? response.data.demographics : [],
        education: Array.isArray(response.data.education) ? response.data.education : [],
        experience: Array.isArray(response.data.experience) ? response.data.experience : [],
        adoption: Array.isArray(response.data.adoption) ? response.data.adoption : [],
        knowledge: Array.isArray(response.data.knowledge) ? response.data.knowledge : [],
        benefitAreas: Array.isArray(response.data.benefitAreas) ? response.data.benefitAreas : [],
        stakeholderViews: Array.isArray(response.data.stakeholderViews) ? response.data.stakeholderViews : [],
        governanceModels: Array.isArray(response.data.governanceModels) ? response.data.governanceModels : [],
        // Add percentage calculations for better insights
        totalResponses: response.data.totalResponses || 0,
        completedResponses: response.data.completedResponses || 0,
        completionRate: response.data.completionRate || 0,
        avgCompletionTime: response.data.avgCompletionTime || "N/A"
      };
      
      setDashboardData(processedData);
      setLastRefresh(new Date());
      toast.success("Analytics data refreshed successfully");
    } catch (err: any) {
      console.error("Analytics error details:", {
        message: err.message,
        code: err.code,
        response: err.response,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
        config: err.config
      });
      
      // Enhanced error handling with detailed logging
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token expired or invalid - only clear on explicit auth failure
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('token');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('sessionExpiry');
        setAuthenticated(false);
        toast.error("Session expired. Please login again.");
        return;
      } else if (err.code === 'ECONNABORTED' || !err.response) {
        // Network error - don't clear session
        console.warn("Analytics fetch failed due to network error, keeping session");
        setError("Network error - please check your connection");
        toast.error("Network error loading analytics");
        return;
      } else if (err.message?.includes('CORS') || err.message?.includes('cross-origin')) {
        // CORS error
        console.error("CORS error detected");
        setError("CORS error - please contact administrator");
        toast.error("Access denied - CORS policy issue");
        return;
      }
      
      const errorMessage = err.response?.data?.message || err.message || "Failed to load analytics data";
      setError(errorMessage);
      toast.error("Failed to load analytics: " + errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  // Enhanced authentication verification with session persistence
  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      
      try {
        const isAuthenticated = checkAuthStatus();
        
        if (isAuthenticated) {
          // Trust local session for initial load, verify server later
          setAuthenticated(true);
          
          // Delay server verification to avoid immediate session expiry after login
          setTimeout(async () => {
            try {
              const serverAuth = await verifyAuthStatus();
              if (!serverAuth) {
                // Only clear session if server explicitly rejects
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('token');
                localStorage.removeItem('adminUsername');
                localStorage.removeItem('sessionExpiry');
                setAuthenticated(false);
                toast.error("Session expired. Please login again.");
              }
            } catch (error) {
              console.warn("Server verification failed, keeping local session:", error);
              // Don't clear session on network errors
            }
          }, 2000); // Wait 2 seconds before server verification
          
          // Load analytics immediately with local auth
          await fetchAnalytics();
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        setAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    
    verifyAuth();
  }, [fetchAnalytics]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh && authenticated && !authLoading) {
      interval = setInterval(() => {
        fetchAnalytics();
      }, 300000); // Refresh every 5 minutes
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, authenticated, authLoading, fetchAnalytics]);

  // Session heartbeat to maintain authentication
  useEffect(() => {
    let heartbeat: NodeJS.Timeout;
    
    if (authenticated) {
      heartbeat = setInterval(async () => {
        const isValid = await verifyAuthStatus();
        if (!isValid) {
          setAuthenticated(false);
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('token');
          toast.error("Session expired. Please login again.");
        }
      }, 600000); // Check every 10 minutes
    }
    
    return () => {
      if (heartbeat) {
        clearInterval(heartbeat);
      }
    };
  }, [authenticated]);

  const handleLoginSuccess = useCallback(() => {
    // Refresh authentication state after successful login
    setAuthenticated(true);
    setAuthLoading(false);
    
    // Fetch analytics data
    fetchAnalytics();
    
    toast.success("Welcome to the Admin Dashboard!");
  }, [fetchAnalytics]);

  const exportAnalytics = (format: 'json' | 'csv' = 'json') => {
    if (!dashboardData) {
      toast.error("No data to export");
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      const exportData = {
        summary: {
          totalResponses: dashboardData.totalResponses,
          completedResponses: dashboardData.completedResponses,
          completionRate: dashboardData.completionRate,
          avgCompletionTime: dashboardData.avgCompletionTime,
          lastRefresh: lastRefresh.toISOString()
        },
        analytics: {
          demographics: dashboardData.demographics,
          education: dashboardData.education,
          experience: dashboardData.experience,
          adoption: dashboardData.adoption,
          knowledge: dashboardData.knowledge,
          benefitAreas: dashboardData.benefitAreas,
          stakeholderViews: dashboardData.stakeholderViews,
          governanceModels: dashboardData.governanceModels
        },
        metadata: {
          exportedAt: new Date().toISOString(),
          exportFormat: 'json',
          dataVersion: '2.0'
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-export-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Create CSV data
      let csvContent = "Category,Item,Value,Percentage\n";
      
      // Add summary data
      csvContent += `Summary,Total Responses,${dashboardData.totalResponses},\n`;
      csvContent += `Summary,Completed Responses,${dashboardData.completedResponses},\n`;
      csvContent += `Summary,Completion Rate,${dashboardData.completionRate},${dashboardData.completionRate}%\n`;
      
      // Add analytics data
      const categories = ['demographics', 'education', 'experience', 'adoption', 'knowledge', 'benefitAreas', 'stakeholderViews', 'governanceModels'];
      
      categories.forEach(category => {
        const data = dashboardData[category] || [];
        const total = data.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
        
        data.forEach((item: any) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
          csvContent += `${category},${item.name},${item.value},${percentage}%\n`;
        });
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-export-${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    toast.success(`Analytics data exported successfully as ${format.toUpperCase()}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#FFF200] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#FFF200] mx-auto mb-4" />
          <p className="text-white text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <AdminLoginForm 
        onLoginSuccess={handleLoginSuccess}
        title="Admin Dashboard Login"
        description="Enter your credentials to access questionnaire analytics"
      />
    );
  }

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#FFF200] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#FFF200] mx-auto mb-4" />
          <p className="text-white text-lg">Loading analytics...</p>
          <p className="text-white/70 text-sm mt-2">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#FFF200] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Error Loading Analytics</h2>
          <p className="text-white/80 mb-4">{error}</p>
          <div className="space-y-2">
            <Button 
              onClick={fetchAnalytics} 
              className="bg-[#FFF200] text-black hover:bg-[#FFF200]/90 w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <p className="text-white/60 text-xs">
              Current URL: {window.location.href}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Improved summary metrics extraction with fallbacks
  const totalResponses = dashboardData?.totalResponses || 
    (dashboardData?.demographics?.reduce((sum, item) => sum + (item.value || 0), 0) || 0);
  
  // Improved completion rate calculation with fallback
  const completedResponses = dashboardData?.completedResponses || 0;
  const completionRate = dashboardData?.completionRate || 
    (totalResponses > 0 ? Math.round((completedResponses / totalResponses) * 100) : 0);
    
  // Add the getChartData function here
  const getChartData = (dataKey, fallback = []) => {
    if (dashboardData && dashboardData[dataKey] && Array.isArray(dashboardData[dataKey])) {
      return dashboardData[dataKey];
    }
    if (dashboardData && dashboardData[dataKey] && typeof dashboardData[dataKey] === 'object') {
      return Object.entries(dashboardData[dataKey]).map(([name, value]) => ({ name, value: typeof value === 'number' ? value : 0 }));
    }
    return fallback;
  };

  // Define all data variables here
  const demographicsData = getChartData('demographics');
  const educationData = getChartData('education');
  const experienceData = getChartData('experience');
  const adoptionData = getChartData('adoption');
  const knowledgeData = getChartData('knowledge');
  const benefitAreasData = getChartData('benefitAreas');
  const stakeholderViewsData = getChartData('stakeholderViews');
  const governanceModelsData = getChartData('governanceModels');
  
  return (
    <div className="bg-gradient-to-br from-black via-black to-[#FFF200] min-h-screen pb-16">
      <AdminNavBar currentPage="dashboard" />
      
      <div className="container mx-auto pt-24 px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">Survey Analytics Dashboard</h1>
              <Badge variant="secondary" className="bg-green-500 text-white">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
            <p className="text-white/70 mb-3">Real-time insights from urban tokenization survey responses</p>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {dashboardData ? `${dashboardData.totalResponses || 0} responses` : 'Loading...'}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              className={autoRefresh ? "bg-green-600 text-white hover:bg-green-700" : "bg-white text-black hover:bg-white/90"}
            >
              <Activity className="h-4 w-4 mr-2" />
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
            
            <Button 
              onClick={fetchAnalytics} 
              disabled={loading}
              className="bg-white text-black hover:bg-white/90"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <div className="flex gap-1">
              <Button 
                onClick={() => exportAnalytics('json')}
                className="bg-[#FFF200] text-black hover:bg-[#FFF200]/90"
              >
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button 
                onClick={() => exportAnalytics('csv')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Responses</CardTitle>
              <div className="p-2 bg-blue-500 rounded-full">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalResponses}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Survey submissions
              </p>
              <div className="mt-2 h-1 bg-blue-200 rounded-full">
                <div className="h-1 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Completed</CardTitle>
              <div className="p-2 bg-green-500 rounded-full">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{completedResponses}</div>
              <p className="text-xs text-green-600 mt-1">
                Fully completed surveys
              </p>
              <div className="mt-2 h-1 bg-green-200 rounded-full">
                <div 
                  className="h-1 bg-green-500 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((completedResponses / Math.max(totalResponses, 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Completion Rate</CardTitle>
              <div className="p-2 bg-purple-500 rounded-full">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{completionRate}%</div>
              <p className="text-xs text-purple-600 mt-1">
                Response quality metric
              </p>
              <div className="mt-2 h-1 bg-purple-200 rounded-full">
                <div 
                  className="h-1 bg-purple-500 rounded-full transition-all duration-500" 
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Avg. Time</CardTitle>
              <div className="p-2 bg-orange-500 rounded-full">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{dashboardData?.avgCompletionTime || "8.4 min"}</div>
              <p className="text-xs text-orange-600 mt-1">
                Time to complete
              </p>
              <div className="mt-2 h-1 bg-orange-200 rounded-full">
                <div className="h-1 bg-orange-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabbed Interface */}
        <Tabs defaultValue="demographics">
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 w-full max-w-3xl mx-auto">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="benefits">Benefits & Areas</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics" className="space-y-8">
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Respondent Occupation</CardTitle>
                <CardDescription>Distribution of survey participants by occupation</CardDescription>
              </CardHeader>
              <CardContent>
                {demographicsData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={demographicsData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <defs>
                          <linearGradient id="colorDemographics" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={60}
                          fontSize={12}
                          stroke="#666"
                        />
                        <YAxis fontSize={12} stroke="#666" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Respondents" 
                          fill="url(#colorDemographics)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No occupation data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white text-black">
                <CardHeader>
                  <CardTitle>Education Level</CardTitle>
                  <CardDescription>Educational background of respondents</CardDescription>
                </CardHeader>
                <CardContent>
                  {educationData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={educationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            stroke="#fff"
                            strokeWidth={2}
                          >
                            {educationData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No education data available</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white text-black">
                <CardHeader>
                  <CardTitle>Years of Experience</CardTitle>
                  <CardDescription>Professional experience distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {experienceData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={experienceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            stroke="#fff"
                            strokeWidth={2}
                          >
                            {experienceData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No experience data available</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge" className="space-y-8">
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Adoption Likelihood in Next 5-10 Years</CardTitle>
                <CardDescription>Predicted adoption timeline for tokenization</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {adoptionData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={adoptionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          fontSize={12}
                          stroke="#666"
                        />
                        <YAxis fontSize={12} stroke="#666" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Respondents" 
                          fill="url(#colorAdoption)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No adoption data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Knowledge Levels</CardTitle>
                <CardDescription>Blockchain & tokenization familiarity</CardDescription>
              </CardHeader>
              <CardContent>
                {knowledgeData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={knowledgeData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorKnowledge" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          fontSize={12}
                          stroke="#666"
                        />
                        <YAxis fontSize={12} stroke="#666" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Respondents" 
                          fill="url(#colorKnowledge)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No knowledge data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="benefits" className="space-y-8">
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Infrastructure Areas That Would Benefit Most</CardTitle>
                <CardDescription>Priority areas for tokenization implementation</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {benefitAreasData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={benefitAreasData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient id="colorBenefits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={60}
                          fontSize={12}
                          stroke="#666"
                        />
                        <YAxis fontSize={12} stroke="#666" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Selected by" 
                          fill="url(#colorBenefits)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No benefit areas data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Stakeholder Views on Tokenization</CardTitle>
                <CardDescription>Sentiment analysis of stakeholder perspectives</CardDescription>
              </CardHeader>
              <CardContent>
                {stakeholderViewsData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stakeholderViewsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          stroke="#fff"
                          strokeWidth={2}
                        >
                          {stakeholderViewsData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No stakeholder views data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="governance" className="space-y-8">
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Preferred Governance Models</CardTitle>
                <CardDescription>Governance preferences for tokenization systems</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {governanceModelsData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={governanceModelsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient id="colorGovernance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={60}
                          fontSize={12}
                          stroke="#666"
                        />
                        <YAxis fontSize={12} stroke="#666" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Preferred by" 
                          fill="url(#colorGovernance)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No governance models data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Additional governance insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white text-black">
                <CardHeader>
                  <CardTitle>Governance Summary</CardTitle>
                  <CardDescription>Key governance insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Governance Responses</span>
                      <span className="text-lg font-bold">{governanceModelsData.reduce((sum, item) => sum + item.value, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Most Popular Model</span>
                      <span className="text-lg font-bold">
                        {governanceModelsData.length > 0 
                          ? governanceModelsData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name
                          : "N/A"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Response Diversity</span>
                      <span className="text-lg font-bold">{governanceModelsData.length} models</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white text-black">
                <CardHeader>
                  <CardTitle>Data Quality Metrics</CardTitle>
                  <CardDescription>Survey response quality indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Response Rate</span>
                      <span className="text-lg font-bold text-green-600">{completionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Data Completeness</span>
                      <span className="text-lg font-bold text-blue-600">
                        {Math.round((completedResponses / Math.max(totalResponses, 1)) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Last Updated</span>
                      <span className="text-sm text-gray-600">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="bg-gray-800 border-t border-gray-700 p-4 text-center text-sm text-gray-400 mt-8">
        <p>© 2025 Urban Infrastructure Research Initiative - Admin Portal</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
