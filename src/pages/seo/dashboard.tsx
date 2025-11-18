import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Key, 
  Sitemap, 
  Tag, 
  Link, 
  TrendingUp, 
  Users, 
  BarChart3,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  Upload,
  Target,
  FileText
} from 'lucide-react';
import { useSEOSettings } from '@/hooks/useSEOSettings';
import { useSEOKeywords } from '@/hooks/useSEOKeywords';
import { useSEOSitemaps } from '@/hooks/useSEOSitemaps';
import { useSEOMetaTags } from '@/hooks/useSEOMetaTags';
import { useSEOLinks } from '@/hooks/useSEOLinks';
import { useSEOAnalysis } from '@/hooks/useSEOAnalysis';
import { useSEOCompetitors } from '@/hooks/useSEOCompetitors';
import { useSEORankings } from '@/hooks/useSEORankings';
import { useSEOReports } from '@/hooks/useSEOReports';
import SEOSettingsPanel from '@/components/seo/SEOSettingsPanel';
import KeywordManagement from '@/components/seo/KeywordManagement';
import SitemapGenerator from '@/components/seo/SitemapGenerator';
import MetaTagsManager from '@/components/seo/MetaTagsManager';
import LinkOptimizer from '@/components/seo/LinkOptimizer';
import SEOScoreDashboard from '@/components/seo/SEOScoreDashboard';
import CompetitorAnalysis from '@/components/seo/CompetitorAnalysis';
import { RankingTracker } from '@/components/seo/RankingTracker';
import { SEOReports } from '@/components/seo/SEOReports';

const SEODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // SEO Data Hooks
  const { settings, isLoading: settingsLoading } = useSEOSettings();
  const { keywords, isLoading: keywordsLoading } = useSEOKeywords();
  const { sitemaps, isLoading: sitemapsLoading } = useSEOSitemaps();
  const { metaTags, isLoading: metaTagsLoading } = useSEOMetaTags();
  const { links, isLoading: linksLoading } = useSEOLinks();
  const { analysis, isLoading: analysisLoading } = useSEOAnalysis();
  const { competitors, isLoading: competitorsLoading } = useSEOCompetitors();
  const { rankings, isLoading: rankingsLoading } = useSEORankings();
  const { reports, isLoading: reportsLoading } = useSEOReports();

  const refreshData = () => {
    setLastUpdated(new Date());
    // Refresh all SEO data
    window.location.reload();
  };

  const exportSEOReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      settings,
      keywords: keywords?.slice(0, 10),
      sitemaps,
      metaTags: metaTags?.slice(0, 5),
      links: links?.slice(0, 10),
      analysis,
      competitors: competitors?.slice(0, 5)
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getOverallSEOScore = () => {
    if (!analysis) return 0;
    return analysis.overallScore || 0;
  };

  const getSEOHealthStatus = () => {
    const score = getOverallSEOScore();
    if (score >= 80) return { status: 'excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { status: 'good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { status: 'needs-improvement', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'poor', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const healthStatus = getSEOHealthStatus();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO 优化中心</h1>
              <p className="text-gray-600">全面的搜索引擎优化管理和分析工具</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新数据
              </Button>
              <Button variant="outline" size="sm" onClick={exportSEOReport}>
                <Download className="h-4 w-4 mr-2" />
                导出报告
              </Button>
            </div>
          </div>

          {/* SEO Health Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                SEO 健康度概览
              </CardTitle>
              <CardDescription>
                最后更新: {lastUpdated.toLocaleString('zh-CN')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${healthStatus.bgColor} mb-3`}>
                    {getOverallSEOScore() >= 60 ? (
                      <CheckCircle className={`h-8 w-8 ${healthStatus.color}`} />
                    ) : (
                      <AlertCircle className={`h-8 w-8 ${healthStatus.color}`} />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{getOverallSEOScore()}%</div>
                  <div className="text-sm text-gray-600">SEO 总评分</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{keywords?.length || 0}</div>
                  <div className="text-sm text-gray-600">关键词数量</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{sitemaps?.length || 0}</div>
                  <div className="text-sm text-gray-600">站点地图</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{competitors?.length || 0}</div>
                  <div className="text-sm text-gray-600">竞争对手</div>
                </div>
              </div>
              
              <div className="mt-6">
                <Progress value={getOverallSEOScore()} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>需要改进</span>
                  <span>良好</span>
                  <span>优秀</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              概览
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              设置
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              关键词
            </TabsTrigger>
            <TabsTrigger value="rankings" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              排名追踪
            </TabsTrigger>
            <TabsTrigger value="sitemaps" className="flex items-center gap-2">
              <Sitemap className="h-4 w-4" />
              站点地图
            </TabsTrigger>
            <TabsTrigger value="metatags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Meta标签
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              链接优化
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              竞争对手
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              报告
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SEOScoreDashboard />
              <CompetitorAnalysis />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    关键词状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">总关键词</span>
                      <Badge variant="secondary">{keywords?.length || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">高竞争度</span>
                      <Badge variant="destructive">
                        {keywords?.filter(k => k.competition === 'high').length || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">长尾关键词</span>
                      <Badge variant="outline">
                        {keywords?.filter(k => k.type === 'long-tail').length || 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sitemap className="h-5 w-5" />
                    站点地图状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">XML站点地图</span>
                      <Badge variant="secondary">{sitemaps?.filter(s => s.type === 'xml').length || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">图片站点地图</span>
                      <Badge variant="outline">
                        {sitemaps?.filter(s => s.type === 'image').length || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">最后更新</span>
                      <span className="text-sm text-gray-600">
                        {sitemaps?.[0]?.lastModified ? 
                          new Date(sitemaps[0].lastModified).toLocaleDateString('zh-CN') : 
                          '未生成'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Meta标签状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">页面标签</span>
                      <Badge variant="secondary">{metaTags?.length || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Open Graph</span>
                      <Badge variant="outline">
                        {metaTags?.filter(m => m.ogTitle).length || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Twitter Card</span>
                      <Badge variant="outline">
                        {metaTags?.filter(m => m.twitterCard).length || 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SEOSettingsPanel />
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords">
            <KeywordManagement />
          </TabsContent>

          {/* Sitemaps Tab */}
          <TabsContent value="sitemaps">
            <SitemapGenerator />
          </TabsContent>

          {/* Meta Tags Tab */}
          <TabsContent value="metatags">
            <MetaTagsManager />
          </TabsContent>

          {/* Links Tab */}
          <TabsContent value="links">
            <LinkOptimizer />
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors">
            <CompetitorAnalysis />
          </TabsContent>

          {/* Rankings Tab */}
          <TabsContent value="rankings">
            <RankingTracker />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <SEOReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SEODashboard;