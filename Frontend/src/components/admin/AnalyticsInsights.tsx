import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Target,
  Users,
  BarChart3
} from "lucide-react";

interface AnalyticsInsightsProps {
  data: any;
  loading: boolean;
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const detailedInsights = data?.detailedInsights || {};
  const responsePatterns = data?.responsePatterns || {};
  const barriers = data?.barriers || [];
  const priorities = data?.priorities || [];
  const summary = data?.summary || {};

  // Generate insights based on data
  const generateInsights = () => {
    const insights = [];
    
    // Completion rate insights
    const completionRate = data?.completionRate || 0;
    if (completionRate >= 80) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Excellent Response Rate',
        description: `${completionRate}% completion rate indicates high engagement and survey quality.`,
        recommendation: 'Continue with current survey design and distribution strategy.'
      });
    } else if (completionRate >= 60) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Moderate Response Rate',
        description: `${completionRate}% completion rate suggests room for improvement.`,
        recommendation: 'Consider shortening the survey or improving question clarity.'
      });
    } else {
      insights.push({
        type: 'error',
        icon: TrendingDown,
        title: 'Low Response Rate',
        description: `${completionRate}% completion rate indicates potential issues with survey design.`,
        recommendation: 'Review survey length, question complexity, and user experience.'
      });
    }

    // Knowledge level insights
    const topKnowledge = summary.topKnowledgeLevel;
    if (topKnowledge) {
      if (topKnowledge.toLowerCase().includes('high') || topKnowledge.toLowerCase().includes('expert')) {
        insights.push({
          type: 'success',
          icon: TrendingUp,
          title: 'High Knowledge Base',
          description: `Most respondents have ${topKnowledge} blockchain knowledge.`,
          recommendation: 'Target advanced features and technical implementation details.'
        });
      } else if (topKnowledge.toLowerCase().includes('low') || topKnowledge.toLowerCase().includes('beginner')) {
        insights.push({
          type: 'info',
          icon: Info,
          title: 'Educational Opportunity',
          description: `Most respondents have ${topKnowledge} blockchain knowledge.`,
          recommendation: 'Focus on education and simple, clear explanations of benefits.'
        });
      }
    }

    // Adoption insights
    const adoptionTrend = summary.adoptionTrend;
    if (adoptionTrend) {
      if (adoptionTrend.toLowerCase().includes('likely') || adoptionTrend.toLowerCase().includes('very')) {
        insights.push({
          type: 'success',
          icon: Target,
          title: 'Positive Adoption Outlook',
          description: `${adoptionTrend} adoption likelihood shows market readiness.`,
          recommendation: 'Accelerate development and pilot program planning.'
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  // Top barriers analysis
  const topBarriers = barriers.slice(0, 5);
  const topPriorities = priorities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Key Insights & Recommendations
          </CardTitle>
          <CardDescription>
            AI-generated insights based on survey responses and patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              const colorClasses = {
                success: 'text-green-600 bg-green-50 border-green-200',
                warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                error: 'text-red-600 bg-red-50 border-red-200',
                info: 'text-blue-600 bg-blue-50 border-blue-200'
              };
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${colorClasses[insight.type as keyof typeof colorClasses]}`}>
                  <div className="flex items-start gap-3">
                    <IconComponent className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{insight.title}</h4>
                      <p className="text-sm mb-2">{insight.description}</p>
                      <p className="text-xs font-medium">
                        <strong>Recommendation:</strong> {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Response Patterns
            </CardTitle>
            <CardDescription>
              Analysis of user behavior and completion patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Average Responses per Submission</span>
                  <Badge variant="outline">
                    {responsePatterns.averageResponsesPerSubmission?.toFixed(1) || 'N/A'}
                  </Badge>
                </div>
                <Progress 
                  value={Math.min((responsePatterns.averageResponsesPerSubmission || 0) * 10, 100)} 
                  className="h-2"
                />
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Completion Quality</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Complete Responses</span>
                    <div className="font-semibold text-green-600">
                      {data?.completedResponses || 0}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Partial Responses</span>
                    <div className="font-semibold text-yellow-600">
                      {(data?.totalResponses || 0) - (data?.completedResponses || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Barriers */}
        {topBarriers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Implementation Barriers
              </CardTitle>
              <CardDescription>
                Most commonly cited challenges and obstacles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topBarriers.map((barrier, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{barrier.name}</div>
                      <div className="text-xs text-gray-500">
                        {barrier.value} mentions ({barrier.percentage}%)
                      </div>
                    </div>
                    <Progress 
                      value={barrier.percentage} 
                      className="w-20 h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Priorities */}
        {topPriorities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Implementation Priorities
              </CardTitle>
              <CardDescription>
                Most important areas for focus and development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPriorities.map((priority, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{priority.name}</div>
                      <div className="text-xs text-gray-500">
                        {priority.value} selections ({priority.percentage}%)
                      </div>
                    </div>
                    <Progress 
                      value={priority.percentage} 
                      className="w-20 h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Geographic Insights */}
        {detailedInsights.geographicInsights && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-indigo-600" />
                Geographic Insights
              </CardTitle>
              <CardDescription>
                Regional distribution and coverage analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Total Regions</span>
                    <div className="text-2xl font-bold text-indigo-600">
                      {detailedInsights.geographicInsights.totalRegions || 0}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Coverage</span>
                    <div className="text-2xl font-bold text-green-600">
                      {detailedInsights.geographicInsights.totalRegions > 5 ? 'High' : 
                       detailedInsights.geographicInsights.totalRegions > 2 ? 'Medium' : 'Low'}
                    </div>
                  </div>
                </div>
                
                {detailedInsights.geographicInsights.topRegions && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Top Regions</h4>
                    <div className="space-y-2">
                      {detailedInsights.geographicInsights.topRegions.slice(0, 3).map((region: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{region.name}</span>
                          <Badge variant="secondary">{region.value} responses</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};