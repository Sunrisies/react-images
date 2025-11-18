import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Mail, 
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Globe,
  Target,
  Settings
} from 'lucide-react';
import { useSEOReports } from '@/hooks/useSEOReports';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

interface SEOReportsProps {
  className?: string;
}

export const SEOReports: React.FC<SEOReportsProps> = ({ className }) => {
  const {
    reports,
    isLoading,
    error,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    scheduleReport,
    exportReport,
    getReportTemplates
  } = useSEOReports();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState<any>(null);

  // Form states
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('monthly');
  const [reportFrequency, setReportFrequency] = useState('monthly');
  const [reportRecipients, setReportRecipients] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'rankings', 'traffic', 'keywords', 'backlinks', 'competitors'
  ]);

  const availableMetrics = [
    { id: 'rankings', name: '排名追踪', icon: Target },
    { id: 'traffic', name: '流量分析', icon: TrendingUp },
    { id: 'keywords', name: '关键词分析', icon: Globe },
    { id: 'backlinks', name: '反向链接', icon: BarChart3 },
    { id: 'competitors', name: '竞争对手', icon: Target },
    { id: 'technical', name: '技术SEO', icon: Settings },
    { id: 'content', name: '内容分析', icon: FileText }
  ];

  const reportTypes = [
    { id: 'monthly', name: '月度报告', description: '每月SEO表现总结' },
    { id: 'weekly', name: '周度报告', description: '每周SEO表现总结' },
    { id: 'quarterly', name: '季度报告', description: '每季度SEO表现总结' },
    { id: 'annual', name: '年度报告', description: '年度SEO表现总结' },
    { id: 'custom', name: '自定义报告', description: '自定义时间范围报告' }
  ];

  const frequencies = [
    { id: 'daily', name: '每日' },
    { id: 'weekly', name: '每周' },
    { id: 'monthly', name: '每月' },
    { id: 'quarterly', name: '每季度' }
  ];

  const handleCreateReport = async () => {
    if (!reportName.trim()) {
      toast.error('请输入报告名称');
      return;
    }

    try {
      await createReport({
        name: reportName,
        type: reportType,
        frequency: reportFrequency,
        recipients: reportRecipients.split(',').map(email => email.trim()).filter(Boolean),
        description: reportDescription,
        metrics: selectedMetrics,
        enabled: true
      });

      setShowCreateDialog(false);
      resetForm();
      toast.success('报告创建成功');
    } catch (error) {
      toast.error('创建报告失败');
      console.error('Failed to create report:', error);
    }
  };

  const handleUpdateReport = async () => {
    if (!editingReport) return;

    try {
      await updateReport(editingReport.id, {
        name: reportName,
        type: reportType,
        frequency: reportFrequency,
        recipients: reportRecipients.split(',').map(email => email.trim()).filter(Boolean),
        description: reportDescription,
        metrics: selectedMetrics,
        enabled: editingReport.enabled
      });

      setShowCreateDialog(false);
      setEditingReport(null);
      resetForm();
      toast.success('报告更新成功');
    } catch (error) {
      toast.error('更新报告失败');
      console.error('Failed to update report:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('确定要删除这个报告吗？')) return;

    try {
      await deleteReport(reportId);
      toast.success('报告删除成功');
    } catch (error) {
      toast.error('删除报告失败');
      console.error('Failed to delete report:', error);
    }
  };

  const handleGenerateReport = async (reportId: string) => {
    try {
      await generateReport(reportId);
      toast.success('报告生成成功');
    } catch (error) {
      toast.error('生成报告失败');
      console.error('Failed to generate report:', error);
    }
  };

  const handleScheduleReport = async (reportId: string) => {
    try {
      await scheduleReport(reportId, {
        frequency: reportFrequency,
        recipients: reportRecipients.split(',').map(email => email.trim()).filter(Boolean)
      });
      setShowScheduleDialog(false);
      toast.success('报告调度设置成功');
    } catch (error) {
      toast.error('设置报告调度失败');
      console.error('Failed to schedule report:', error);
    }
  };

  const resetForm = () => {
    setReportName('');
    setReportType('monthly');
    setReportFrequency('monthly');
    setReportRecipients('');
    setReportDescription('');
    setSelectedMetrics(['rankings', 'traffic', 'keywords', 'backlinks', 'competitors']);
  };

  const openEditDialog = (report: any) => {
    setEditingReport(report);
    setReportName(report.name);
    setReportType(report.type);
    setReportFrequency(report.frequency);
    setReportRecipients(report.recipients.join(', '));
    setReportDescription(report.description || '');
    setSelectedMetrics(report.metrics || []);
    setShowCreateDialog(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'error': return 'destructive';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'paused': return '暂停';
      case 'error': return '错误';
      case 'pending': return '待处理';
      default: return '未知';
    }
  };

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            SEO报告
          </CardTitle>
          <CardDescription>自动化SEO报告生成和管理</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">加载报告失败: {error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              重试
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              SEO报告管理
            </h2>
            <p className="text-gray-600">创建和管理自动化SEO报告</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              创建报告
            </Button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">加载报告中...</span>
            </div>
          </CardContent>
        </Card>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无报告</h3>
            <p className="text-gray-600 mb-4">创建您的第一个SEO报告开始监控网站表现</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              创建报告
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(report.status)}>
                    {getStatusText(report.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Report Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    类型: {reportTypes.find(t => t.id === report.type)?.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    频率: {frequencies.find(f => f.id === report.frequency)?.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    收件人: {report.recipients?.length || 0} 个
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">包含指标</Label>
                  <div className="flex flex-wrap gap-1">
                    {report.metrics?.slice(0, 3).map((metric: string) => {
                      const metricInfo = availableMetrics.find(m => m.id === metric);
                      return (
                        <Badge key={metric} variant="outline" className="text-xs">
                          {metricInfo?.name || metric}
                        </Badge>
                      );
                    })}
                    {report.metrics?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{report.metrics.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Last Generated */}
                {report.lastGenerated && (
                  <div className="text-xs text-gray-500">
                    最后生成: {format(new Date(report.lastGenerated), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerateReport(report.id)}
                    disabled={report.status === 'generating'}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    生成
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(report)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    编辑
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowScheduleDialog(true)}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    调度
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportReport(report.id)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    导出
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingReport ? '编辑报告' : '创建SEO报告'}
            </DialogTitle>
            <DialogDescription>
              配置自动化SEO报告的参数和内容
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportName">报告名称 *</Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="例如：月度SEO表现报告"
                />
              </div>
              
              <div>
                <Label htmlFor="reportType">报告类型</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="reportType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="reportDescription">报告描述</Label>
              <Textarea
                id="reportDescription"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="描述报告的内容和目的"
                rows={3}
              />
            </div>
            
            <div>
              <Label>包含指标</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableMetrics.map(metric => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`metric-${metric.id}`}
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMetrics([...selectedMetrics, metric.id]);
                          } else {
                            setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`metric-${metric.id}`} className="flex items-center gap-2 cursor-pointer">
                        <Icon className="h-4 w-4" />
                        {metric.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <Label htmlFor="reportRecipients">收件人邮箱</Label>
              <Input
                id="reportRecipients"
                value={reportRecipients}
                onChange={(e) => setReportRecipients(e.target.value)}
                placeholder="多个邮箱用逗号分隔"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setEditingReport(null);
              resetForm();
            }}>
              取消
            </Button>
            <Button onClick={editingReport ? handleUpdateReport : handleCreateReport}>
              {editingReport ? '更新' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>报告调度设置</DialogTitle>
            <DialogDescription>
              配置报告的自动生成和发送频率
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reportFrequency">发送频率</Label>
              <Select value={reportFrequency} onValueChange={setReportFrequency}>
                <SelectTrigger id="reportFrequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map(freq => (
                    <SelectItem key={freq.id} value={freq.id}>
                      {freq.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="scheduleRecipients">收件人</Label>
              <Input
                id="scheduleRecipients"
                value={reportRecipients}
                onChange={(e) => setReportRecipients(e.target.value)}
                placeholder="多个邮箱用逗号分隔"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              取消
            </Button>
            <Button onClick={() => selectedReport && handleScheduleReport(selectedReport)}>
              保存设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};