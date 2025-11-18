import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Upload,
  BarChart3,
  TrendingUp,
  Globe,
  Target,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { useSEOKeywords, useSEOKeywordGroups, useSEOKeywordSuggestions, useSEOKeywordDensity } from '@/hooks/useSEOKeywords';
import { SEOKeyword, SEOKeywordInput, SEOKeywordType, SEOKeywordCompetition } from '@/types/seo.types';
import { toast } from 'sonner';

const KeywordManagement: React.FC = () => {
  const { 
    keywords, 
    isLoading, 
    createKeyword, 
    updateKeyword, 
    deleteKeyword, 
    analyzeKeyword, 
    bulkAnalyzeKeywords, 
    importKeywords, 
    exportKeywords,
    isCreating,
    isUpdating,
    isDeleting,
    isAnalyzing,
    isBulkAnalyzing,
    isImporting,
    isExporting
  } = useSEOKeywords();
  
  const { groups } = useSEOKeywordGroups();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<SEOKeywordType | 'all'>('all');
  const [selectedCompetition, setSelectedCompetition] = useState<SEOKeywordCompetition | 'all'>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<SEOKeyword | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [seedKeyword, setSeedKeyword] = useState('');
  const [densityContent, setDensityContent] = useState('');
  const [densityKeyword, setDensityKeyword] = useState('');

  const [formData, setFormData] = useState<SEOKeywordInput>({
    keyword: '',
    type: 'primary',
    competition: 'medium',
    searchVolume: 0,
    cpc: 0,
    difficulty: 0,
    trends: [],
    groups: [],
    notes: '',
    tags: [],
    url: '',
    language: 'zh-CN',
    location: 'CN'
  });

  const { suggestions } = useSEOKeywordSuggestions(seedKeyword);
  const { density } = useSEOKeywordDensity(densityContent, densityKeyword);

  const filteredKeywords = keywords.filter(keyword => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || keyword.type === selectedType;
    const matchesCompetition = selectedCompetition === 'all' || keyword.competition === selectedCompetition;
    const matchesGroup = selectedGroup === 'all' || keyword.groups?.includes(selectedGroup);
    
    return matchesSearch && matchesType && matchesCompetition && matchesGroup;
  });

  const handleCreateKeyword = async () => {
    try {
      await createKeyword(formData);
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create keyword:', error);
    }
  };

  const handleUpdateKeyword = async () => {
    if (!editingKeyword) return;
    
    try {
      await updateKeyword({ id: editingKeyword.id, keyword: formData });
      setEditingKeyword(null);
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to update keyword:', error);
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    if (confirm('确定要删除这个关键词吗？')) {
      try {
        await deleteKeyword(id);
      } catch (error) {
        console.error('Failed to delete keyword:', error);
      }
    }
  };

  const handleAnalyzeKeyword = async (keyword: string) => {
    try {
      await analyzeKeyword(keyword);
    } catch (error) {
      console.error('Failed to analyze keyword:', error);
    }
  };

  const handleBulkAnalyze = async () => {
    const selectedKeywords = filteredKeywords.map(k => k.keyword);
    if (selectedKeywords.length === 0) {
      toast.error('请先选择要分析的关键词');
      return;
    }
    
    try {
      await bulkAnalyzeKeywords(selectedKeywords);
    } catch (error) {
      console.error('Failed to bulk analyze keywords:', error);
    }
  };

  const handleImportKeywords = async () => {
    try {
      const keywords = importData.split('\n').map(line => line.trim()).filter(line => line);
      const keywordInputs: SEOKeywordInput[] = keywords.map(keyword => ({
        keyword,
        type: 'primary',
        competition: 'medium',
        searchVolume: 0,
        cpc: 0,
        difficulty: 0,
        trends: [],
        groups: [],
        notes: '',
        tags: [],
        url: '',
        language: 'zh-CN',
        location: 'CN'
      }));
      
      await importKeywords(keywordInputs);
      setShowImportDialog(false);
      setImportData('');
    } catch (error) {
      console.error('Failed to import keywords:', error);
    }
  };

  const handleExportKeywords = async () => {
    try {
      await exportKeywords('csv');
    } catch (error) {
      console.error('Failed to export keywords:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      keyword: '',
      type: 'primary',
      competition: 'medium',
      searchVolume: 0,
      cpc: 0,
      difficulty: 0,
      trends: [],
      groups: [],
      notes: '',
      tags: [],
      url: '',
      language: 'zh-CN',
      location: 'CN'
    });
  };

  const openEditDialog = (keyword: SEOKeyword) => {
    setEditingKeyword(keyword);
    setFormData({
      keyword: keyword.keyword,
      type: keyword.type,
      competition: keyword.competition,
      searchVolume: keyword.searchVolume,
      cpc: keyword.cpc,
      difficulty: keyword.difficulty,
      trends: keyword.trends,
      groups: keyword.groups,
      notes: keyword.notes,
      tags: keyword.tags,
      url: keyword.url,
      language: keyword.language,
      location: keyword.location
    });
    setShowAddDialog(true);
  };

  const getCompetitionColor = (competition: SEOKeywordCompetition) => {
    switch (competition) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: SEOKeywordType) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-800';
      case 'secondary': return 'bg-purple-100 text-purple-800';
      case 'long-tail': return 'bg-indigo-100 text-indigo-800';
      case 'branded': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">关键词管理</h2>
          <p className="text-gray-600">管理和分析您的SEO关键词库</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleBulkAnalyze} disabled={isBulkAnalyzing}>
            <BarChart3 className="h-4 w-4 mr-2" />
            {isBulkAnalyzing ? '分析中...' : '批量分析'}
          </Button>
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            导入
          </Button>
          <Button variant="outline" onClick={handleExportKeywords} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? '导出中...' : '导出'}
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加关键词
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingKeyword ? '编辑关键词' : '添加关键词'}</DialogTitle>
                <DialogDescription>
                  {editingKeyword ? '更新关键词信息' : '添加新的关键词到您的词库'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyword">关键词</Label>
                    <Input
                      id="keyword"
                      value={formData.keyword}
                      onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                      placeholder="输入关键词"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">类型</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as SEOKeywordType }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="primary">主要关键词</option>
                      <option value="secondary">次要关键词</option>
                      <option value="long-tail">长尾关键词</option>
                      <option value="branded">品牌关键词</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="searchVolume">搜索量</Label>
                    <Input
                      id="searchVolume"
                      type="number"
                      value={formData.searchVolume}
                      onChange={(e) => setFormData(prev => ({ ...prev, searchVolume: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpc">CPC</Label>
                    <Input
                      id="cpc"
                      type="number"
                      step="0.01"
                      value={formData.cpc}
                      onChange={(e) => setFormData(prev => ({ ...prev, cpc: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">难度</Label>
                    <Input
                      id="difficulty"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.difficulty}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty: parseInt(e.target.value) || 0 }))}
                      placeholder="0-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="competition">竞争度</Label>
                    <select
                      id="competition"
                      value={formData.competition}
                      onChange={(e) => setFormData(prev => ({ ...prev, competition: e.target.value as SEOKeywordCompetition }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url">目标URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/page"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">备注</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="添加备注信息"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  取消
                </Button>
                <Button onClick={editingKeyword ? handleUpdateKeyword : handleCreateKeyword}>
                  {editingKeyword ? '更新' : '创建'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Keyword Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            关键词建议
          </CardTitle>
          <CardDescription>基于种子关键词获取相关建议</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="输入种子关键词..."
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              className="flex-1"
            />
          </div>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-50">
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keyword Density Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            关键词密度分析
          </CardTitle>
          <CardDescription>分析内容中的关键词密度</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label>分析内容</Label>
              <Textarea
                placeholder="粘贴要分析的内容..."
                value={densityContent}
                onChange={(e) => setDensityContent(e.target.value)}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>目标关键词</Label>
              <Input
                placeholder="输入要分析的关键词"
                value={densityKeyword}
                onChange={(e) => setDensityKeyword(e.target.value)}
              />
              {density && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>密度:</span>
                    <span className={density.density > 0.05 ? 'text-red-600' : density.density < 0.01 ? 'text-yellow-600' : 'text-green-600'}>
                      {(density.density * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>出现次数:</span>
                    <span>{density.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>建议:</span>
                    <span className="text-blue-600">{density.recommendation}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            筛选器
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>搜索关键词</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索关键词..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>关键词类型</Label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as SEOKeywordType | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部类型</option>
                <option value="primary">主要关键词</option>
                <option value="secondary">次要关键词</option>
                <option value="long-tail">长尾关键词</option>
                <option value="branded">品牌关键词</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>竞争度</Label>
              <select
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value as SEOKeywordCompetition | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部竞争度</option>
                <option value="low">低竞争</option>
                <option value="medium">中竞争</option>
                <option value="high">高竞争</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>分组</Label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部分组</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            关键词列表 ({filteredKeywords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>关键词</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>搜索量</TableHead>
                  <TableHead>CPC</TableHead>
                  <TableHead>难度</TableHead>
                  <TableHead>竞争度</TableHead>
                  <TableHead>趋势</TableHead>
                  <TableHead>分组</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeywords.map((keyword) => (
                  <TableRow key={keyword.id}>
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(keyword.type)}>
                        {keyword.type === 'primary' ? '主要' : 
                         keyword.type === 'secondary' ? '次要' :
                         keyword.type === 'long-tail' ? '长尾' : '品牌'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{keyword.searchVolume.toLocaleString()}</span>
                        {keyword.searchVolume > 10000 && <TrendingUp className="h-4 w-4 text-green-500" />}
                      </div>
                    </TableCell>
                    <TableCell>¥{keyword.cpc.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>难度</span>
                          <span>{keyword.difficulty}%</span>
                        </div>
                        <Progress value={keyword.difficulty} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCompetitionColor(keyword.competition)}>
                        {keyword.competition === 'low' ? '低' : 
                         keyword.competition === 'medium' ? '中' : '高'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {keyword.trends && keyword.trends.length > 0 && (
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                          <span className="text-xs">{keyword.trends.length}个</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {keyword.groups?.map(groupId => {
                          const group = groups.find(g => g.id === groupId);
                          return group ? (
                            <Badge key={groupId} variant="outline" className="text-xs">
                              {group.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAnalyzeKeyword(keyword.keyword)}
                          disabled={isAnalyzing}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(keyword)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteKeyword(keyword.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredKeywords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>没有找到匹配的关键词</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>导入关键词</DialogTitle>
            <DialogDescription>
              每行输入一个关键词，系统将自动创建关键词记录
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>关键词数据</Label>
              <Textarea
                placeholder="输入关键词，每行一个..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={10}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              取消
            </Button>
            <Button onClick={handleImportKeywords} disabled={isImporting}>
              {isImporting ? '导入中...' : '导入关键词'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KeywordManagement;