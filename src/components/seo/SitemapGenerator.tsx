import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Map,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Send,
  FileText,
  Link,
  Image,
  Video,
  Music
} from 'lucide-react'
import { useSEOSitemaps, useSEOSitemapTypes, useSEOSitemapRules } from '@/hooks/useSEOSitemaps'
import { SEOSitemap, SEOSitemapInput, SEOSitemapType } from '@/types/seo.types'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const SitemapGenerator: React.FC = () => {
  const {
    sitemaps,
    isLoading,
    createSitemap,
    updateSitemap,
    deleteSitemap,
    generateSitemap,
    submitSitemap,
    validateSitemap,
    isCreating,
    isUpdating,
    isDeleting,
    isGenerating,
    isSubmitting,
    isValidating
  } = useSEOSitemaps()

  const { types } = useSEOSitemapTypes()
  const { rules } = useSEOSitemapRules()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<SEOSitemapType | 'all'>('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingSitemap, setEditingSitemap] = useState<SEOSitemap | null>(null)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [urlsInput, setUrlsInput] = useState('')
  const [generationProgress, setGenerationProgress] = useState(0)
  const [xmlPreview, setXmlPreview] = useState('')
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  const [formData, setFormData] = useState<SEOSitemapInput>({
    name: '',
    type: 'xml',
    urls: [],
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
    autoUpdate: true,
    submitToSearchEngines: true,
    maxUrls: 50000,
    compression: true,
    description: '',
    tags: [],
    language: 'zh-CN',
    location: 'CN'
  })

  const filteredSitemaps = sitemaps.filter(sitemap => {
    const matchesSearch = sitemap.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || sitemap.type === selectedType
    return matchesSearch && matchesType
  })

  const handleCreateSitemap = async () => {
    try {
      await createSitemap(formData)
      setShowAddDialog(false)
      resetForm()
    } catch (error) {
      console.error('Failed to create sitemap:', error)
    }
  }

  const handleUpdateSitemap = async () => {
    if (!editingSitemap) return

    try {
      await updateSitemap({ id: editingSitemap.id, sitemap: formData })
      setEditingSitemap(null)
      setShowAddDialog(false)
      resetForm()
    } catch (error) {
      console.error('Failed to update sitemap:', error)
    }
  }

  const handleDeleteSitemap = async (id: string) => {
    if (confirm('确定要删除这个站点地图吗？')) {
      try {
        await deleteSitemap(id)
      } catch (error) {
        console.error('Failed to delete sitemap:', error)
      }
    }
  }

  const handleGenerateSitemap = async () => {
    const urls = urlsInput.split('\n').map(url => url.trim()).filter(url => url)
    if (urls.length === 0) {
      alert('请输入至少一个URL')
      return
    }

    try {
      setGenerationProgress(0)
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      await generateSitemap(urls)
      clearInterval(interval)
      setGenerationProgress(100)
      setShowGenerateDialog(false)
      setUrlsInput('')

      setTimeout(() => setGenerationProgress(0), 2000)
    } catch (error) {
      console.error('Failed to generate sitemap:', error)
      setGenerationProgress(0)
    }
  }

  const handleSubmitSitemap = async (id: string) => {
    try {
      await submitSitemap(id)
    } catch (error) {
      console.error('Failed to submit sitemap:', error)
    }
  }

  const handleValidateSitemap = async (id: string) => {
    try {
      await validateSitemap(id)
    } catch (error) {
      console.error('Failed to validate sitemap:', error)
    }
  }

  const handlePreviewXml = (sitemap: SEOSitemap) => {
    const xmlContent = generateXmlPreview(sitemap)
    setXmlPreview(xmlContent)
    setShowPreviewDialog(true)
  }

  const generateXmlPreview = (sitemap: SEOSitemap): string => {
    const urls = sitemap.urls.slice(0, 5) // Show first 5 URLs as preview

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${format(new Date(url.lastModified), 'yyyy-MM-dd')}</lastmod>
    <changefreq>${sitemap.changeFrequency}</changefreq>
    <priority>${sitemap.priority}</priority>
  </url>`).join('\n')}
${sitemap.urls.length > 5 ? `  <!-- ... ${sitemap.urls.length - 5} more URLs ... -->` : ''}
</urlset>`
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'xml',
      urls: [],
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
      autoUpdate: true,
      submitToSearchEngines: true,
      maxUrls: 50000,
      compression: true,
      description: '',
      tags: [],
      language: 'zh-CN',
      location: 'CN'
    })
  }

  const openEditDialog = (sitemap: SEOSitemap) => {
    setEditingSitemap(sitemap)
    setFormData({
      name: sitemap.name,
      type: sitemap.type,
      urls: sitemap.urls,
      lastModified: sitemap.lastModified,
      changeFrequency: sitemap.changeFrequency,
      priority: sitemap.priority,
      autoUpdate: sitemap.autoUpdate,
      submitToSearchEngines: sitemap.submitToSearchEngines,
      maxUrls: sitemap.maxUrls,
      compression: sitemap.compression,
      description: sitemap.description,
      tags: sitemap.tags,
      language: sitemap.language,
      location: sitemap.location
    })
    setShowAddDialog(true)
  }

  const getTypeIcon = (type: SEOSitemapType) => {
    switch (type) {
      case 'xml': return <FileText className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'news': return <Globe className="h-4 w-4" />
      case 'mobile': return <Globe className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: SEOSitemapType) => {
    switch (type) {
      case 'xml': return 'bg-blue-100 text-blue-800'
      case 'image': return 'bg-green-100 text-green-800'
      case 'video': return 'bg-purple-100 text-purple-800'
      case 'news': return 'bg-red-100 text-red-800'
      case 'mobile': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">站点地图生成器</h2>
          <p className="text-gray-600">创建和管理XML站点地图，优化搜索引擎索引</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={ showGenerateDialog } onOpenChange={ setShowGenerateDialog }>
            <DialogTrigger asChild>
              <Button>
                <RefreshCw className="h-4 w-4 mr-2" />
                生成站点地图
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>生成站点地图</DialogTitle>
                <DialogDescription>
                  输入URL列表来自动生成站点地图
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                { generationProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>生成进度</span>
                      <span>{ generationProgress }%</span>
                    </div>
                    <Progress value={ generationProgress } className="h-2" />
                  </div>
                ) }
                <div className="space-y-2">
                  <Label>URL列表</Label>
                  <Textarea
                    placeholder="输入URL，每行一个...&#10;例如:&#10;https://example.com/&#10;https://example.com/about&#10;https://example.com/contact"
                    value={ urlsInput }
                    onChange={ (e) => setUrlsInput(e.target.value) }
                    rows={ 10 }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={ () => setShowGenerateDialog(false) }>
                  取消
                </Button>
                <Button onClick={ handleGenerateSitemap } disabled={ isGenerating }>
                  { isGenerating ? '生成中...' : '生成' }
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={ showAddDialog } onOpenChange={ setShowAddDialog }>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                创建站点地图
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{ editingSitemap ? '编辑站点地图' : '创建站点地图' }</DialogTitle>
                <DialogDescription>
                  { editingSitemap ? '更新站点地图配置' : '创建新的站点地图配置' }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">名称</Label>
                    <Input
                      id="name"
                      value={ formData.name }
                      onChange={ (e) => setFormData(prev => ({ ...prev, name: e.target.value })) }
                      placeholder="输入站点地图名称"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">类型</Label>
                    <select
                      id="type"
                      value={ formData.type }
                      onChange={ (e) => setFormData(prev => ({ ...prev, type: e.target.value as SEOSitemapType })) }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="xml">XML站点地图</option>
                      <option value="image">图片站点地图</option>
                      <option value="video">视频站点地图</option>
                      <option value="news">新闻站点地图</option>
                      <option value="mobile">移动站点地图</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    value={ formData.description }
                    onChange={ (e) => setFormData(prev => ({ ...prev, description: e.target.value })) }
                    placeholder="输入描述信息"
                    rows={ 2 }
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="changeFrequency">更新频率</Label>
                    <select
                      id="changeFrequency"
                      value={ formData.changeFrequency }
                      onChange={ (e) => setFormData(prev => ({ ...prev, changeFrequency: e.target.value })) }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="always">总是</option>
                      <option value="hourly">每小时</option>
                      <option value="daily">每天</option>
                      <option value="weekly">每周</option>
                      <option value="monthly">每月</option>
                      <option value="yearly">每年</option>
                      <option value="never">从不</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">优先级</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={ formData.priority }
                      onChange={ (e) => setFormData(prev => ({ ...prev, priority: parseFloat(e.target.value) || 0.5 })) }
                      placeholder="0.0-1.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxUrls">最大URL数</Label>
                    <Input
                      id="maxUrls"
                      type="number"
                      min="1"
                      max="50000"
                      value={ formData.maxUrls }
                      onChange={ (e) => setFormData(prev => ({ ...prev, maxUrls: parseInt(e.target.value) || 50000 })) }
                      placeholder="50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">语言</Label>
                    <Input
                      id="language"
                      value={ formData.language }
                      onChange={ (e) => setFormData(prev => ({ ...prev, language: e.target.value })) }
                      placeholder="zh-CN"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoUpdate"
                      checked={ formData.autoUpdate }
                      onChange={ (e) => setFormData(prev => ({ ...prev, autoUpdate: e.target.checked })) }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="autoUpdate">自动更新</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="submitToSearchEngines"
                      checked={ formData.submitToSearchEngines }
                      onChange={ (e) => setFormData(prev => ({ ...prev, submitToSearchEngines: e.target.checked })) }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="submitToSearchEngines">提交到搜索引擎</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="compression"
                      checked={ formData.compression }
                      onChange={ (e) => setFormData(prev => ({ ...prev, compression: e.target.checked })) }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="compression">启用压缩</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={ () => setShowAddDialog(false) }>
                  取消
                </Button>
                <Button onClick={ editingSitemap ? handleUpdateSitemap : handleCreateSitemap }>
                  { editingSitemap ? '更新' : '创建' }
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* map Rules */ }
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            站点地图规则 ({ rules.length })
          </CardTitle>
          <CardDescription>管理站点地图生成规则</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            { rules.map((rule, index) => (
              <div key={ index } className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{ rule.name }</h4>
                  <Badge variant="outline">{ rule.type }</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{ rule.description }</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">编辑</Button>
                  <Button variant="outline" size="sm">删除</Button>
                </div>
              </div>
            )) }
          </div>
        </CardContent>
      </Card>

      {/* Filters */ }
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            筛选器
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>搜索站点地图</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索站点地图..."
                  value={ searchTerm }
                  onChange={ (e) => setSearchTerm(e.target.value) }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>类型</Label>
              <select
                value={ selectedType }
                onChange={ (e) => setSelectedType(e.target.value as SEOSitemapType | 'all') }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部类型</option>
                <option value="xml">XML站点地图</option>
                <option value="image">图片站点地图</option>
                <option value="video">视频站点地图</option>
                <option value="news">新闻站点地图</option>
                <option value="mobile">移动站点地图</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sitemaps Table */ }
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            站点地图列表 ({ filteredSitemaps.length })
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>URL数量</TableHead>
                  <TableHead>最后更新</TableHead>
                  <TableHead>更新频率</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                { filteredSitemaps.map((sitemap) => (
                  <TableRow key={ sitemap.id }>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        { getTypeIcon(sitemap.type) }
                        { sitemap.name }
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={ getTypeColor(sitemap.type) }>
                        { sitemap.type === 'xml' ? 'XML' :
                          sitemap.type === 'image' ? '图片' :
                            sitemap.type === 'video' ? '视频' :
                              sitemap.type === 'news' ? '新闻' :
                                sitemap.type === 'mobile' ? '移动' : sitemap.type }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{ sitemap.urls.length.toLocaleString() }</span>
                        { sitemap.urls.length > 1000 && (
                          <Badge variant="outline" className="text-xs">大型</Badge>
                        ) }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          { format(new Date(sitemap.lastModified), 'MM-dd HH:mm', { locale: zhCN }) }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        { sitemap.changeFrequency === 'always' ? '总是' :
                          sitemap.changeFrequency === 'hourly' ? '每小时' :
                            sitemap.changeFrequency === 'daily' ? '每天' :
                              sitemap.changeFrequency === 'weekly' ? '每周' :
                                sitemap.changeFrequency === 'monthly' ? '每月' :
                                  sitemap.changeFrequency === 'yearly' ? '每年' : '从不' }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>优先级</span>
                          <span>{ sitemap.priority }</span>
                        </div>
                        <Progress value={ sitemap.priority * 100 } className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={ getStatusColor(sitemap.status) }>
                        { sitemap.status === 'active' ? '活跃' :
                          sitemap.status === 'pending' ? '待处理' :
                            sitemap.status === 'error' ? '错误' : '未知' }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={ () => handlePreviewXml(sitemap) }
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={ () => handleValidateSitemap(sitemap.id) }
                          disabled={ isValidating }
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={ () => handleSubmitSitemap(sitemap.id) }
                          disabled={ isSubmitting }
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={ () => openEditDialog(sitemap) }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={ () => handleDeleteSitemap(sitemap.id) }
                          disabled={ isDeleting }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </div>

          { filteredSitemaps.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <map className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>没有找到匹配的站点地图</p>
            </div>
          ) }
        </CardContent>
      </Card>

      {/* XML Preview Dialog */ }
      <Dialog open={ showPreviewDialog } onOpenChange={ setShowPreviewDialog }>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>XML预览</DialogTitle>
            <DialogDescription>
              站点地图XML内容预览
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>XML内容</Label>
              <Textarea
                value={ xmlPreview }
                readOnly
                rows={ 20 }
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={ () => setShowPreviewDialog(false) }>
              关闭
            </Button>
            <Button onClick={ () => navigator.clipboard.writeText(xmlPreview) }>
              复制XML
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SitemapGenerator