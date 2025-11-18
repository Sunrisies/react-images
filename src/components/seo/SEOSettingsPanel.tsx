import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Globe, 
  Search, 
  Bot, 
  Languages, 
  RefreshCw,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useSEOSettings, useSEOSettingsLanguages, useSEOCrawlSettings } from '@/hooks/useSEOSettings';
import { SEOSettingsInput } from '@/types/seo.types';

const SEOSettingsPanel: React.FC = () => {
  const { settings, isLoading, updateSettings, resetSettings, testRobotsTxt, isUpdating, isResetting, isTestingRobots } = useSEOSettings();
  const { languages } = useSEOSettingsLanguages();
  const { crawlSettings, updateCrawlSettings, isUpdating: isUpdatingCrawl } = useSEOCrawlSettings();
  
  const [formData, setFormData] = useState<SEOSettingsInput>({
    siteName: '',
    siteDescription: '',
    defaultLanguage: 'zh-CN',
    robotsTxt: '',
    enableSitemap: true,
    enableAnalytics: true,
    enableSearchConsole: false,
    searchConsoleId: '',
    analyticsId: '',
    metaTitleTemplate: '{title} | {siteName}',
    metaDescriptionTemplate: '{description}',
    enableOpenGraph: true,
    enableTwitterCard: true,
    enableStructuredData: true,
    canonicalUrl: '',
    enableHreflang: false,
    languages: ['zh-CN'],
    crawlDelay: 1,
    enableCrawlDelay: false,
  });

  const [robotsContent, setRobotsContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setRobotsContent(settings.robotsTxt || '');
    }
  }, [settings]);

  const handleInputChange = (field: keyof SEOSettingsInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleRobotsChange = (content: string) => {
    setRobotsContent(content);
    handleInputChange('robotsTxt', content);
  };

  const handleSave = async () => {
    try {
      await updateSettings(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleReset = async () => {
    try {
      await resetSettings();
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };

  const handleTestRobots = async () => {
    try {
      await testRobotsTxt(robotsContent);
    } catch (error) {
      console.error('Failed to test robots.txt:', error);
    }
  };

  const handleCrawlSettingsChange = async (field: string, value: any) => {
    try {
      const updatedSettings = { ...crawlSettings, [field]: value };
      await updateCrawlSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update crawl settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SEO 设置</h2>
          <p className="text-gray-600">配置全局SEO设置和搜索引擎优化选项</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} disabled={isResetting}>
            <RotateCcw className="h-4 w-4 mr-2" />
            重置为默认
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isUpdating}>
            <Save className="h-4 w-4 mr-2" />
            {isUpdating ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            您有未保存的更改。记得点击"保存设置"按钮来应用更改。
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            常规设置
          </TabsTrigger>
          <TabsTrigger value="meta" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Meta设置
          </TabsTrigger>
          <TabsTrigger value="crawl" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            爬取设置
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            高级设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>网站基本信息</CardTitle>
              <CardDescription>设置网站的基本SEO信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">网站名称</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    placeholder="输入网站名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">默认语言</Label>
                  <Select
                    value={formData.defaultLanguage}
                    onValueChange={(value) => handleInputChange('defaultLanguage', value)}
                  >
                    <SelectTrigger id="defaultLanguage">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name} ({lang.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">网站描述</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  placeholder="输入网站描述"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">规范URL</Label>
                <Input
                  id="canonicalUrl"
                  type="url"
                  value={formData.canonicalUrl}
                  onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>分析工具集成</CardTitle>
              <CardDescription>配置搜索引擎分析工具</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAnalytics">启用Google Analytics</Label>
                  <p className="text-sm text-gray-600">集成Google Analytics跟踪</p>
                </div>
                <Switch
                  id="enableAnalytics"
                  checked={formData.enableAnalytics}
                  onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked)}
                />
              </div>
              
              {formData.enableAnalytics && (
                <div className="space-y-2">
                  <Label htmlFor="analyticsId">Google Analytics ID</Label>
                  <Input
                    id="analyticsId"
                    value={formData.analyticsId}
                    onChange={(e) => handleInputChange('analyticsId', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableSearchConsole">启用Search Console</Label>
                  <p className="text-sm text-gray-600">集成Google Search Console</p>
                </div>
                <Switch
                  id="enableSearchConsole"
                  checked={formData.enableSearchConsole}
                  onCheckedChange={(checked) => handleInputChange('enableSearchConsole', checked)}
                />
              </div>
              
              {formData.enableSearchConsole && (
                <div className="space-y-2">
                  <Label htmlFor="searchConsoleId">Search Console ID</Label>
                  <Input
                    id="searchConsoleId"
                    value={formData.searchConsoleId}
                    onChange={(e) => handleInputChange('searchConsoleId', e.target.value)}
                    placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meta标签模板</CardTitle>
              <CardDescription>配置默认的Meta标签模板</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitleTemplate">标题模板</Label>
                <Input
                  id="metaTitleTemplate"
                  value={formData.metaTitleTemplate}
                  onChange={(e) => handleInputChange('metaTitleTemplate', e.target.value)}
                  placeholder="{title} | {siteName}"
                />
                <p className="text-sm text-gray-600">
                  可用变量: {title}, {siteName}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescriptionTemplate">描述模板</Label>
                <Textarea
                  id="metaDescriptionTemplate"
                  value={formData.metaDescriptionTemplate}
                  onChange={(e) => handleInputChange('metaDescriptionTemplate', e.target.value)}
                  placeholder="{description}"
                  rows={2}
                />
                <p className="text-sm text-gray-600">
                  可用变量: {description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>社交分享标签</CardTitle>
              <CardDescription>配置Open Graph和Twitter Card标签</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableOpenGraph">启用Open Graph</Label>
                  <p className="text-sm text-gray-600">支持Facebook等平台的分享优化</p>
                </div>
                <Switch
                  id="enableOpenGraph"
                  checked={formData.enableOpenGraph}
                  onCheckedChange={(checked) => handleInputChange('enableOpenGraph', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableTwitterCard">启用Twitter Card</Label>
                  <p className="text-sm text-gray-600">支持Twitter平台的分享优化</p>
                </div>
                <Switch
                  id="enableTwitterCard"
                  checked={formData.enableTwitterCard}
                  onCheckedChange={(checked) => handleInputChange('enableTwitterCard', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableStructuredData">启用结构化数据</Label>
                  <p className="text-sm text-gray-600">添加JSON-LD结构化数据</p>
                </div>
                <Switch
                  id="enableStructuredData"
                  checked={formData.enableStructuredData}
                  onCheckedChange={(checked) => handleInputChange('enableStructuredData', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crawl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>robots.txt 配置</CardTitle>
              <CardDescription>配置搜索引擎爬取规则</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="robotsContent">robots.txt 内容</Label>
                <Textarea
                  id="robotsContent"
                  value={robotsContent}
                  onChange={(e) => handleRobotsChange(e.target.value)}
                  placeholder="User-agent: *&#10;Disallow: /admin/&#10;Allow: /"
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleTestRobots} disabled={isTestingRobots}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isTestingRobots ? '验证中...' : '验证robots.txt'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>爬取设置</CardTitle>
              <CardDescription>配置搜索引擎爬取行为</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableSitemap">启用站点地图</Label>
                  <p className="text-sm text-gray-600">自动生成和更新XML站点地图</p>
                </div>
                <Switch
                  id="enableSitemap"
                  checked={formData.enableSitemap}
                  onCheckedChange={(checked) => handleInputChange('enableSitemap', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableCrawlDelay">启用爬取延迟</Label>
                  <p className="text-sm text-gray-600">控制搜索引擎爬取频率</p>
                </div>
                <Switch
                  id="enableCrawlDelay"
                  checked={formData.enableCrawlDelay}
                  onCheckedChange={(checked) => handleInputChange('enableCrawlDelay', checked)}
                />
              </div>
              
              {formData.enableCrawlDelay && (
                <div className="space-y-2">
                  <Label htmlFor="crawlDelay">爬取延迟 (秒)</Label>
                  <Input
                    id="crawlDelay"
                    type="number"
                    min="0.1"
                    max="60"
                    step="0.1"
                    value={formData.crawlDelay}
                    onChange={(e) => handleInputChange('crawlDelay', parseFloat(e.target.value))}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>多语言设置</CardTitle>
              <CardDescription>配置网站的多语言SEO支持</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableHreflang">启用hreflang标签</Label>
                  <p className="text-sm text-gray-600">为多语言页面添加hreflang标签</p>
                </div>
                <Switch
                  id="enableHreflang"
                  checked={formData.enableHreflang}
                  onCheckedChange={(checked) => handleInputChange('enableHreflang', checked)}
                />
              </div>

              {formData.enableHreflang && (
                <div className="space-y-2">
                  <Label>支持的语言</Label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <Badge
                        key={lang.code}
                        variant={formData.languages?.includes(lang.code) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          const currentLangs = formData.languages || [];
                          const newLangs = currentLangs.includes(lang.code)
                            ? currentLangs.filter(l => l !== lang.code)
                            : [...currentLangs, lang.code];
                          handleInputChange('languages', newLangs);
                        }}
                      >
                        {lang.name} ({lang.code})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOSettingsPanel;