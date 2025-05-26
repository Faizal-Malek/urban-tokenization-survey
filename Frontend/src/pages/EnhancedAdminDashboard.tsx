import { useState, useEffect, useCallback } from "react";
import { checkAuthStatus, verifyAuthStatus } from "@/utils/auth";
import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AnalyticsOverview } from "@/components/admin/AnalyticsOverview";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { AnalyticsInsights } from "@/components/admin/AnalyticsInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  RefreshCw, 
  Download, 
  AlertCircle,
  BarChart3,
  TrendingUp,
  Users,
  Settings,
  FileText
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const EnhancedAdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Get API base URL from environment or use localhost for development
  const getApiBaseUrl = () => {
    // Check if we're in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000'; // Local development server
    }
    // Production URL
    return 'https://urban-tokenization-survey.onrender.com';
  };

  const fetchAnalytics = useCallback(async () => {
    if (!authenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = getApiBaseUrl();
      
      console.log("Fetching analytics from:", `${apiBaseUrl}/api/questionnaire/analytics`);
      console.log("Using token:", token ? `${token.substring(0, 20)}...` : 'No token');
      
      const response = await axios.get(`${apiBaseUrl}/api/questionnaire/analytics`, { 
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Cache-Control': 'no-cache',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 30000,
        withCredentials: true // Enable credentials for cookie-based auth
      });
      
      console.log("Analytics data received:", response.data);
      
      // Process and validate the data
      const processedData = {
        ...response.data,
        // Ensure all required arrays exist
        demographics: Array.isArray(response.data.demographics) ? response.data.demographics : [],
        education: Array.isArray(response.data.education) ? response.data.education : [],
        experience: Array.isArray(response.data.experience) ? response.data.experience : [],
        adoption: Array.isArray(response.data.adoption) ? response.data.adoption : [],
        knowledge: Array.isArray(response.data.knowledge) ? response.data.knowledge : [],
        benefitAreas: Array.isArray(response.data.benefitAreas) ? response.data.benefitAreas : [],
        stakeholderViews: Array.isArray(response.data.stakeholderViews) ? response.data.stakeholderViews : [],
        governanceModels: Array.isArray(response.data.governanceModels) ? response.data.governanceModels : [],
        timeSeriesData: Array.isArray(response.data.timeSeriesData) ? response.data.timeSeriesData : [],
        geographicData: Array.isArray(response.data.geographicData) ? response.data.geographicData : [],
        technologyReadiness: Array.isArray(response.data.technologyReadiness) ? response.data.technologyReadiness : [],
        barriers: Array.isArray(response.data.barriers) ? response.data.barriers : [],
        priorities: Array.isArray(response.data.priorities) ? response.data.priorities : [],
        satisfactionMetrics: Array.isArray(response.data.satisfactionMetrics) ? response.data.satisfactionMetrics : [],
        // Ensure objects exist
        responsePatterns: response.data.responsePatterns || {},
        detailedInsights: response.data.detailedInsights || {},
        summary: response.data.summary || {}
      };
      
      setDashboardData(processedData);
      setLastRefresh(new Date());
      toast.success("Analytics data refreshed successfully");
    } catch (err: any) {
      console.error("Analytics error:", err);
      console.error("Error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log("Authentication failed, clearing session data");
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('token');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('sessionExpiry');
        setAuthenticated(false);
        toast.error("Session expired. Please login again.");
        return;
      }
      
      let errorMessage = "Failed to load analytics data";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.debug) {
        errorMessage = `${err.response.data.message || 'Authentication error'} (Debug: ${JSON.stringify(err.response.data.debug)})`;
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout - please check your connection";
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = "Network error - unable to reach server";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error("Failed to load analytics: " + errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  // Authentication verification
  useEffect(() => {
    const verifyAuth = async () => {
      setAuthLoading(true);
      
      try {
        const isAuthenticated = checkAuthStatus();
        
        if (isAuthenticated) {
          setAuthenticated(true);
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

  const handleLoginSuccess = useCallback(() => {
    setAuthenticated(true);
    setAuthLoading(false);
    fetchAnalytics();
    toast.success("Welcome to the Enhanced Admin Dashboard!");
  }, [fetchAnalytics]);

  const exportAnalytics = (format: 'json' | 'csv' = 'json') => {
    if (!dashboardData) {
      toast.error("No data to export");
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      const exportData = {
        summary: dashboardData.summary,
        analytics: {
          demographics: dashboardData.demographics,
          education: dashboardData.education,
          experience: dashboardData.experience,
          adoption: dashboardData.adoption,
          knowledge: dashboardData.knowledge,
          benefitAreas: dashboardData.benefitAreas,
          stakeholderViews: dashboardData.stakeholderViews,
          governanceModels: dashboardData.governanceModels,
          timeSeriesData: dashboardData.timeSeriesData,
          geographicData: dashboardData.geographicData,
          technologyReadiness: dashboardData.technologyReadiness,
          barriers: dashboardData.barriers,
          priorities: dashboardData.priorities
        },
        insights: dashboardData.detailedInsights,
        patterns: dashboardData.responsePatterns,
        metadata: {
          exportedAt: new Date().toISOString(),
          exportFormat: 'json',
          dataVersion: '3.0',
          lastRefresh: lastRefresh.toISOString()
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enhanced-analytics-export-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Enhanced CSV export with more data
      let csvContent = "Category,Item,Value,Percentage,Type\n";
      
      // Add summary data
      csvContent += `Summary,Total Responses,${dashboardData.totalResponses},,metric\n`;
      csvContent += `Summary,Completed Responses,${dashboardData.completedResponses},,metric\n`;
      csvContent += `Summary,Completion Rate,${dashboardData.completionRate},${dashboardData.completionRate}%,metric\n`;
      
      // Add all analytics categories
      const categories = [
        'demographics', 'education', 'experience', 'adoption', 'knowledge', 
        'benefitAreas', 'stakeholderViews', 'governanceModels', 'geographicData',
        'technologyReadiness', 'barriers', 'priorities'
      ];
      
      categories.forEach(category => {
        const data = dashboardData[category] || [];
        data.forEach((item: any) => {
          csvContent += `${category},${item.name},${item.value},${item.percentage || 0}%,data\n`;
        });
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enhanced-analytics-export-${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    toast.success(`Enhanced analytics data exported successfully as ${format.toUpperCase()}`);
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
        title="Enhanced Admin Dashboard Login"
        description="Access comprehensive analytics and insights for the urban tokenization survey"
      />
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
              API URL: {getApiBaseUrl()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Enhanced Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive insights and analytics for the Urban Tokenization Survey
              </p>
              {dashboardData?.lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh {autoRefresh ? 'On' : 'Off'}
              </Button>
              
              <Button
                onClick={fetchAnalytics}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                onClick={() => exportAnalytics('json')}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              
              <Button
                onClick={() => exportAnalytics('csv')}
                variant="outline"
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <AnalyticsOverview data={dashboardData} loading={loading} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Charts & Visualizations
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights & Analysis
            </TabsTrigger>
            <TabsTrigger value="raw-data" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Raw Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            <AnalyticsCharts data={dashboardData} loading={loading} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AnalyticsInsights data={dashboardData} loading={loading} />
          </TabsContent>

          <TabsContent value="raw-data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Raw Analytics Data
                </CardTitle>
                <CardDescription>
                  Complete dataset for advanced analysis and debugging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(dashboardData, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;