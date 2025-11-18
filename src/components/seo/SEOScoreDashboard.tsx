import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Smartphone,
  Tablet,
  Monitor,
  BarChart3,
  Target,
  Zap,
  FileText,
  Link,
  Search,
  Globe,
  Clock,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { useSEOAnalysis } from '@/hooks/useSEOAnalysis';
import { SEOAnalysis, SEOScore, PageAnalysis, MobileAnalysis, ContentAnalysis } from '@/types/seo.types';
import { toast } from 'sonner';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
  color: string;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  maxScore,
  icon,
  color,
  onAnalyze,
  isAnalyzing
}) => {
  const percentage = (score / maxScore) * 100;
  const getColorClass = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${color} p-2 rounded-lg`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{score}/{maxScore}</div>
        <Progress
          value={percentage}
          className={`mt-2 ${getProgressColor()}`}
        />
        <div className="flex justify-between items-center mt-2">
          <p className={`text-xs ${getColorClass()}`}>
            {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Needs Improvement'}
          </p>
          {onAnalyze && (
            <Button
              size="sm"
              variant="outline"
              onClick={onAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                'Analyze'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface IssueListProps {
  issues: Array<{
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  title: string;
}

const IssueList: React.FC<IssueListProps> = ({ issues, title }) => {
  if (issues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-600">No issues found! Great job!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {issues.map(issue => (
            <div key={issue.id} className="border-l-4 pl-4 py-2"
              style={{ borderColor: issue.type === 'error' ? '#ef4444' : issue.type === 'warning' ? '#f59e0b' : '#3b82f6' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{issue.message}</p>
                  <p className="text-sm text-gray-600 mt-1">{issue.recommendation}</p>
                </div>
                <Badge variant={issue.priority === 'high' ? 'destructive' : 'outline'}>
                  {issue.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const SEOScoreDashboard: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<Record<string, boolean>>({});
  const [analysisType, setAnalysisType] = useState<'page' | 'mobile' | 'content'>('page');

  const {
    // analyses,
    // overallScore,
    // pageAnalysis,
    // mobileAnalysis,
    // contentAnalysis,
    // isLoading,
    // runAnalysis,
    // runMobileAnalysis,
    // // runContentAnalysis,
    // getRecommendations,
    // exportReport,
    // shareReport
  } = useSEOAnalysis();

  const handleAnalyze = async (type: 'page' | 'mobile' | 'content') => {
    setIsAnalyzing({ ...isAnalyzing, [type]: true });

    try {
      switch (type) {
        case 'page':
          await runPageAnalysis();
          break;
        case 'mobile':
          await runMobileAnalysis();
          break;
        case 'content':
          await runContentAnalysis();
          break;
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} analysis completed`);
    } catch (error) {
      toast.error(`Failed to run ${type} analysis`);
    } finally {
      setIsAnalyzing({ ...isAnalyzing, [type]: false });
    }
  };

  const runPageAnalysis = async () => {
    // Simulate page analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    // This would typically call the actual analysis function
  };

  // const runMobileAnalysis = async () => {
  //   // Simulate mobile analysis
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   // This would typically call the actual analysis function
  // };

  const runContentAnalysis = async () => {
    // Simulate content analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    // This would typically call the actual analysis function
  };

  const handleExportReport = async () => {
    try {
      await exportReport();
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const handleShareReport = async () => {
    try {
      await shareReport();
      toast.success('Report shared successfully');
    } catch (error) {
      toast.error('Failed to share report');
    }
  };

  // Mock data for demonstration
  const mockScores = {
    overall: 78,
    pageSpeed: 85,
    mobile: 72,
    content: 80,
    technical: 75
  };

  const mockIssues = [
    {
      id: '1',
      type: 'error' as const,
      message: 'Page title is too long (75 characters)',
      recommendation: 'Keep page titles under 60 characters for optimal display',
      priority: 'high' as const
    },
    {
      id: '2',
      type: 'warning' as const,
      message: 'Missing alt text on 3 images',
      recommendation: 'Add descriptive alt text to all images for accessibility and SEO',
      priority: 'medium' as const
    },
    {
      id: '3',
      type: 'info' as const,
      message: 'Meta description could be more compelling',
      recommendation: 'Include a clear call-to-action in your meta description',
      priority: 'low' as const
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-green-100 text-green-800', text: 'Excellent' };
    if (score >= 60) return { color: 'bg-yellow-100 text-yellow-800', text: 'Good' };
    return { color: 'bg-red-100 text-red-800', text: 'Needs Work' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SEO Score Dashboard</h2>
          <p className="text-gray-600">Comprehensive SEO analysis and recommendations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-1" />
            Export Report
          </Button>
          <Button variant="outline" onClick={handleShareReport}>
            <Share2 className="w-4 h-4 mr-1" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Overall SEO Score</h3>
              <p className="text-gray-600">Based on comprehensive analysis</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(mockScores.overall)}`}>
                {mockScores.overall}
              </div>
              <Badge className={getScoreBadge(mockScores.overall).color}>
                {getScoreBadge(mockScores.overall).text}
              </Badge>
            </div>
          </div>
          <Progress value={mockScores.overall} className="mt-4 h-2" />
        </CardContent>
      </Card>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <ScoreCard
          title="Page Speed"
          score={mockScores.pageSpeed}
          maxScore={100}
          icon={<Zap className="w-5 h-5" />}
          color="bg-orange-100 text-orange-600"
          onAnalyze={() => handleAnalyze('page')}
          isAnalyzing={isAnalyzing.page}
        />
        <ScoreCard
          title="Mobile SEO"
          score={mockScores.mobile}
          maxScore={100}
          icon={<Smartphone className="w-5 h-5" />}
          color="bg-blue-100 text-blue-600"
          onAnalyze={() => handleAnalyze('mobile')}
          isAnalyzing={isAnalyzing.mobile}
        />
        <ScoreCard
          title="Content Quality"
          score={mockScores.content}
          maxScore={100}
          icon={<FileText className="w-5 h-5" />}
          color="bg-green-100 text-green-600"
          onAnalyze={() => handleAnalyze('content')}
          isAnalyzing={isAnalyzing.content}
        />
        <ScoreCard
          title="Technical SEO"
          score={mockScores.technical}
          maxScore={100}
          icon={<Target className="w-5 h-5" />}
          color="bg-purple-100 text-purple-600"
        />
        <ScoreCard
          title="Link Profile"
          score={75}
          maxScore={100}
          icon={<Link className="w-5 h-5" />}
          color="bg-indigo-100 text-indigo-600"
        />
      </div>

      {/* Analysis Type Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1 mb-6">
            <Button
              variant={analysisType === 'page' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('page')}
            >
              <Monitor className="w-4 h-4 mr-2" />
              Page Analysis
            </Button>
            <Button
              variant={analysisType === 'mobile' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('mobile')}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile Analysis
            </Button>
            <Button
              variant={analysisType === 'content' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('content')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Content Analysis
            </Button>
          </div>

          {analysisType === 'page' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Page Load Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">2.3s</div>
                    <p className="text-xs text-gray-500">Fast load time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">First Contentful Paint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">1.8s</div>
                    <p className="text-xs text-gray-500">Needs improvement</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Largest Contentful Paint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">3.2s</div>
                    <p className="text-xs text-gray-500">Poor performance</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {analysisType === 'mobile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Mobile Usability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">95/100</div>
                    <Progress value={95} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Mobile Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">68/100</div>
                    <Progress value={68} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {analysisType === 'content' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Word Count</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-xs text-gray-500">Good length</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Readability Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">8.5</div>
                    <p className="text-xs text-gray-500">Easy to read</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Keyword Density</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">2.1%</div>
                    <p className="text-xs text-gray-500">Slightly high</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Content Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">85/100</div>
                    <Progress value={85} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issues and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IssueList
          issues={mockIssues}
          title="Critical Issues"
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Optimization Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Add schema markup</p>
                  <p className="text-sm text-gray-600">Implement structured data for better search visibility</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Optimize images</p>
                  <p className="text-sm text-gray-600">Compress images and add descriptive alt text</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Improve internal linking</p>
                  <p className="text-sm text-gray-600">Create better content connections</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Performance Trends
          </CardTitle>
          <CardDescription>
            Track your SEO improvements over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+12%</div>
              <p className="text-sm text-gray-600">Organic Traffic</p>
              <p className="text-xs text-gray-500">vs last month</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+8%</div>
              <p className="text-sm text-gray-600">Keyword Rankings</p>
              <p className="text-xs text-gray-500">vs last month</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">-5%</div>
              <p className="text-sm text-gray-600">Bounce Rate</p>
              <p className="text-xs text-gray-500">vs last month</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+15%</div>
              <p className="text-sm text-gray-600">Page Views</p>
              <p className="text-xs text-gray-500">vs last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};