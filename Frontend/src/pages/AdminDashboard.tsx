import { useState, useEffect } from "react";
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
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://urban-tokenization-survey.onrender.com/api/auth/login",
        { username, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setAuthenticated(true);
    } catch (err) {
      toast.error("Login failed");
    }
  };

  useEffect(() => {
    axios.get("https://urban-tokenization-survey.onrender.com/api/questionnaire/analytics", { withCredentials: true })
      .then(res => setDashboardData(res.data))
      .catch(err => {
        toast.error("Failed to load analytics");
      });
  }, []);

  if (!authenticated)
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#FFF200] flex flex-col">
        {/* Modern Fixed Navigation Bar (no icon) */}
        <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-5xl bg-[#fffbe6]/90 rounded-xl shadow flex items-center justify-between px-8 py-4 border border-yellow-100">
          <span className="font-bold text-xl text-gray-900">Urban Infrastructure Tokenization Survey</span>
          <a href="/" className="bg-white px-5 py-2 rounded-md shadow text-black font-semibold hover:bg-gray-100 transition">
            Back to Main
          </a>
        </nav>
        {/* Centered Login Card */}
        <main className="flex-1 flex items-center justify-center mt-28">
          <div className="bg-white/95 rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard Login</h2>
            <p className="text-gray-600 mb-6">Enter your credentials to access questionnaire analytics</p>
            <form onSubmit={handleLogin}>
              <label className="block text-gray-800 font-medium mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your username"
              />
              <label className="block text-gray-800 font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your password"
              />
              <button
                type="submit"
                className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 rounded transition"
              >
                Login
              </button>
            </form>
          </div>
        </main>
      </div>
    );

  if (!dashboardData) {
    return <div>Loading analytics...</div>;
  }

  const submissions = dashboardData.submissions || [];
  // Helper to count occurrences for demographics
  const countBy = (arr: any[], section: string, key: string) => {
    const counts: Record<string, number> = {};
    arr.forEach(item => {
      const value = item?.responses?.[section]?.[key];
      if (value) counts[value] = (counts[value] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const countArrayField = (arr, section, key) => {
    const counts = {};
    arr.forEach(item => {
      const values = item?.responses?.[section]?.[key] || [];
      values.forEach(value => {
        if (value) counts[value] = (counts[value] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const demographicsData = countBy(submissions, "demographics", "occupation");
  const educationData = countBy(submissions, "demographics", "educationLevel");
  const experienceData = countBy(submissions, "demographics", "yearsOfExperience");

  const adoptionLikelihoodData = countBy(submissions, "future", "adoptionLikelihood");

  const benefitsData = countArrayField(submissions, "tokenization", "benefits");

  const crossTabulate = (arr, key1, section1, key2, section2) => {
    const table = {};
    arr.forEach(item => {
      const v1 = item?.responses?.[section1]?.[key1];
      const v2 = item?.responses?.[section2]?.[key2];
      if (v1 && v2) {
        table[v1] = table[v1] || {};
        table[v1][v2] = (table[v1][v2] || 0) + 1;
      }
    });
    return table;
  };

  const occupationVsAdoption = crossTabulate(submissions, "occupation", "demographics", "adoptionLikelihood", "future");
  console.log(occupationVsAdoption);

  const timeSeries = submissions.reduce((acc, item) => {
    const date = new Date(item.submittedAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const timeSeriesData = Object.entries(timeSeries).map(([date, value]) => ({ date, value }));

  const stakeholderViewsData = countBy(submissions, "tokenization", "stakeholderViews");
  const governanceModelsData = countArrayField(submissions, "stakeholders", "governanceModels");

  return (
    <div className="bg-gradient-to-br from-black via-black to-[#FFF200] min-h-screen">
      {/* Modern Fixed Navigation Bar (no icon) */}
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-5xl bg-[#fffbe6]/90 rounded-xl shadow flex items-center justify-between px-8 py-4 border border-yellow-100">
        <span className="font-bold text-xl text-gray-900">Urban Infrastructure Tokenization Survey</span>
        <a href="/" className="bg-white px-5 py-2 rounded-md shadow text-black font-semibold hover:bg-gray-100 transition">
          Back to Main
        </a>
      </nav>
      <main className="container mx-auto p-4 lg:p-8 mt-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white text-gray-900 p-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.totalResponses}</div>
              <p className="text-xs text-gray-500">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white text-gray-900 p-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.completionRate}%</div>
              <p className="text-xs text-gray-500">+5% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white text-gray-900 p-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8.4 min</div>
              <p className="text-xs text-gray-500">-0.6 min from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="demographics">
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 w-full max-w-3xl mx-auto bg-black rounded-lg p-1">
            <TabsTrigger value="demographics" className="text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black">Demographics</TabsTrigger>
            <TabsTrigger value="knowledge" className="text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black">Knowledge</TabsTrigger>
            <TabsTrigger value="benefits" className="text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black">Benefits & Areas</TabsTrigger>
            <TabsTrigger value="governance" className="text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black">Governance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics" className="space-y-8">
            <Card className="bg-white text-gray-900 p-8">
              <CardHeader>
                <CardTitle>Respondent Occupation</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="min-h-[380px] pb-12 px-4 overflow-x-auto flex items-center">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={demographicsData}
                      margin={{ top: 30, right: 40, left: 40, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Respondents">
                        {demographicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white text-gray-900 p-8">
                <CardHeader>
                  <CardTitle>Education Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[340px] pb-8 px-4 overflow-x-auto flex items-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart margin={{ top: 40, right: 20, left: 20, bottom: 40 }}>
                        <Pie
                          data={educationData}
                          cx="50%"
                          cy="40%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {educationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} respondents`, 'Count']} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white text-gray-900 p-8">
                <CardHeader>
                  <CardTitle>Years of Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[340px] pb-8 px-4 overflow-x-auto flex items-center">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                        <Pie
                          data={experienceData}
                          cx="50%"
                          cy="40%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {experienceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} respondents`, 'Count']} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge">
            <Card className="bg-white text-gray-900 p-8">
              <CardHeader>
                <CardTitle>Adoption Likelihood in Next 5-10 Years</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="min-h-[380px] pb-12 px-4 overflow-x-auto flex items-center">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={adoptionLikelihoodData}
                      margin={{ top: 30, right: 40, left: 40, bottom: 80 }}
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
          </TabsContent>
          
          <TabsContent value="benefits" className="space-y-8">
            <Card className="bg-white text-gray-900 p-8">
              <CardHeader>
                <CardTitle>Infrastructure Areas That Would Benefit Most</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="min-h-[380px] pb-12 px-4 overflow-x-auto flex items-center">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={dashboardData.benefitAreas}
                      margin={{ top: 30, right: 40, left: 40, bottom: 80 }}
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
            
            <Card className="bg-white text-gray-900 p-8">
              <CardHeader>
                <CardTitle>Stakeholder Views on Tokenization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[320px] pb-8 px-4 overflow-x-auto flex items-center">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
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
                        {Array.isArray(stakeholderViewsData) && stakeholderViewsData.map((entry, index) => (
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
            <Card className="bg-white text-gray-900 p-8">
              <CardHeader>
                <CardTitle>Preferred Governance Models</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="min-h-[380px] pb-12 px-4 overflow-x-auto flex items-center">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={governanceModelsData}
                      margin={{ top: 30, right: 40, left: 40, bottom: 80 }}
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
      </main>
      
      <footer className="bg-gray-100 border-t p-4 text-center text-sm text-gray-600 mt-8">
        <p>© 2025 Urban Infrastructure Research Initiative - Admin Portal</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
