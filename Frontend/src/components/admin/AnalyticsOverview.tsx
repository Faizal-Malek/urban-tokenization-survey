import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  Activity,
  BarChart3,
  Calendar,
  Target
} from "lucide-react";

interface AnalyticsOverviewProps {
  data: any;
  loading: boolean;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const summary = data?.summary || {};
  const totalResponses = data?.totalResponses || 0;
  const completedResponses = data?.completedResponses || 0;
  const completionRate = data?.completionRate || 0;
  const avgCompletionTime = data?.avgCompletionTime || "N/A";

  const overviewCards = [
    {
      title: "Total Responses",
      value: totalResponses.toLocaleString(),
      description: "Survey submissions received",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: totalResponses > 0 ? "+100%" : "0%"
    },
    {
      title: "Completed Responses",
      value: completedResponses.toLocaleString(),
      description: "Fully completed surveys",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: `${completionRate}%`
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: "Response completion percentage",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: completionRate >= 70 ? "Good" : completionRate >= 50 ? "Fair" : "Low"
    },
    {
      title: "Avg. Completion Time",
      value: avgCompletionTime,
      description: "Average time to complete",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "Optimal"
    },
    {
      title: "Top Occupation",
      value: summary.topOccupation || "N/A",
      description: "Most common respondent role",
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      trend: "Primary"
    },
    {
      title: "Top Education",
      value: summary.topEducation || "N/A",
      description: "Most common education level",
      icon: BarChart3,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      trend: "Dominant"
    },
    {
      title: "Knowledge Level",
      value: summary.topKnowledgeLevel || "N/A",
      description: "Most common blockchain knowledge",
      icon: Activity,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "Prevalent"
    },
    {
      title: "Adoption Trend",
      value: summary.adoptionTrend || "N/A",
      description: "Primary adoption likelihood",
      icon: Calendar,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      trend: "Leading"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {overviewCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  {card.description}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};