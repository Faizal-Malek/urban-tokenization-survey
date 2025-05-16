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
        .then(res => {
          console.log("Analytics data structure:", JSON.stringify(res.data, null, 2));
          setDashboardData(res.data);
        })
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
        <h1 className="text-3xl font-bold text-white mb-8">Survey Analytics Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalResponses}</div>
              {dashboardData?.responseTrend && (
                <p className="text-xs text-muted-foreground">{dashboardData.responseTrend}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completionRate}%</div>
              {dashboardData?.completionTrend && (
                <p className="text-xs text-muted-foreground">{dashboardData.completionTrend}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData?.avgCompletionTime || "N/A"}</div>
              {dashboardData?.timeTrend && (
                <p className="text-xs text-muted-foreground">{dashboardData.timeTrend}</p>
              )}
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
            <Card>
              <CardHeader>
                <CardTitle>Respondent Occupation</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.demographics || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Respondents" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Education Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData?.education || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {(dashboardData?.education || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} respondents`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Years of Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData?.experience || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {(dashboardData?.experience || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} respondents`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge">
            <Card>
              <CardHeader>
                <CardTitle>Adoption Likelihood in Next 5-10 Years</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
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
                      <Bar dataKey="value" name="Respondents" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="benefits" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Areas That Would Benefit Most</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.benefitAreas || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Selected by" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stakeholder Views on Tokenization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData?.stakeholderViews || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {(dashboardData?.stakeholderViews || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} respondents`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="governance">
            <Card>
              <CardHeader>
                <CardTitle>Preferred Governance Models</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.governanceModels || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Respondents" fill="#a4de6c" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
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
