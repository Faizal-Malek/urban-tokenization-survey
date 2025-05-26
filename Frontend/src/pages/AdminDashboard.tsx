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
import { Button } from "@/components/ui/button";
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
  AreaChart
} from "recharts";
import axios from "axios";
import { toast } from "sonner";
import { RefreshCw, Download, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";

// Chart colors
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(checkAuthStatus());
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!authenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get("https://urban-tokenization-survey.onrender.com/api/questionnaire/analytics", { 
        withCredentials: true,
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      console.log("Analytics data structure:", JSON.stringify(response.data, null, 2));
      setDashboardData(response.data);
      toast.success("Analytics data refreshed successfully");
    } catch (err: any) {
      console.error("Analytics error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      setError(errorMessage);
      toast.error("Failed to load analytics: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [authenticated]);

  const exportAnalytics = () => {
    if (!dashboardData) {
      toast.error("No data to export");
      return;
    }

    const exportData = {
      summary: {
        totalResponses: dashboardData.totalResponses,
        completedResponses: dashboardData.completedResponses,
        completionRate: dashboardData.completionRate,
        avgCompletionTime: dashboardData.avgCompletionTime
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
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Analytics data exported successfully");
  };

  if (!authenticated) {
    return (
      <AdminLoginForm 
        onLoginSuccess={() => setAuthenticated(true)}
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
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#FFF200] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error loading analytics</p>
            <p>{error}</p>
          </div>
          <Button onClick={fetchAnalytics} className="bg-[#FFF200] text-black hover:bg-[#FFF200]/90">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Survey Analytics Dashboard</h1>
            <p className="text-white/70">Real-time insights from urban tokenization survey responses</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              onClick={fetchAnalytics} 
              disabled={loading}
              className="bg-white text-black hover:bg-white/90"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={exportAnalytics}
              className="bg-[#FFF200] text-black hover:bg-[#FFF200]/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{totalResponses}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Survey submissions
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{completedResponses}</div>
              <p className="text-xs text-muted-foreground">
                Fully completed surveys
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Response quality metric
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Avg. Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{dashboardData?.avgCompletionTime || "8.4 min"}</div>
              <p className="text-xs text-muted-foreground">
                Time to complete
              </p>
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Respondents" fill="#8884d8" />
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
                          >
                            {educationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} respondents`, 'Count']} />
                          <Legend />
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
                          >
                            {experienceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} respondents`, 'Count']} />
                          <Legend />
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Respondents" fill="#82ca9d" />
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Respondents" fill="#8884d8" />
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Selected by" fill="#8884d8" />
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
                        >
                          {stakeholderViewsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} respondents`, 'Count']} />
                        <Legend />
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Preferred by" fill="#82ca9d" />
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
