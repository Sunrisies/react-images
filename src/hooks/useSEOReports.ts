import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoService } from '@/services/seo';
import { toast } from 'sonner';
import type { 
  SEOReport, 
  SEOReportCreateData, 
  SEOReportUpdateData,
  SEOReportSchedule,
  SEOReportTemplate 
} from '@/types/seo.types';

interface UseSEOReportsReturn {
  reports: SEOReport[];
  isLoading: boolean;
  error: Error | null;
  createReport: (data: SEOReportCreateData) => Promise<void>;
  updateReport: (id: string, data: SEOReportUpdateData) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  generateReport: (id: string) => Promise<void>;
  scheduleReport: (id: string, schedule: SEOReportSchedule) => Promise<void>;
  exportReport: (id: string, format?: 'pdf' | 'excel' | 'csv') => Promise<void>;
  getReportTemplates: () => Promise<SEOReportTemplate[]>;
  duplicateReport: (id: string) => Promise<void>;
  pauseReport: (id: string) => Promise<void>;
  resumeReport: (id: string) => Promise<void>;
}

export function useSEOReports(): UseSEOReportsReturn {
  const queryClient = useQueryClient();
  const [reports, setReports] = useState<SEOReport[]>([]);

  // Fetch reports
  const { data: fetchedReports = [], isLoading, error } = useQuery({
    queryKey: ['seo-reports'],
    queryFn: seoService.getReports,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update local state when fetched data changes
  useEffect(() => {
    setReports(fetchedReports);
  }, [fetchedReports]);

  // Create report
  const createReportMutation = useMutation({
    mutationFn: (data: SEOReportCreateData) => seoService.createReport(data),
    onSuccess: (newReport) => {
      queryClient.invalidateQueries({ queryKey: ['seo-reports'] });
      toast.success('SEO报告创建成功');
    },
    onError: (error) => {
      toast.error('创建SEO报告失败');
      console.error('Failed to create report:', error);
    }
  });

  const createReport = useCallback(async (data: SEOReportCreateData) => {
    await createReportMutation.mutateAsync(data);
  }, [createReportMutation]);

  // Update report
  const updateReportMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SEOReportUpdateData }) =>
      seoService.updateReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-reports'] });
      toast.success('SEO报告更新成功');
    },
    onError: (error) => {
      toast.error('更新SEO报告失败');
      console.error('Failed to update report:', error);
    }
  });

  const updateReport = useCallback(async (id: string, data: SEOReportUpdateData) => {
    await updateReportMutation.mutateAsync({ id, data });
  }, [updateReportMutation]);

  // Delete report
  const deleteReportMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-reports'] });
      toast.success('SEO报告删除成功');
    },
    onError: (error) => {
      toast.error('删除SEO报告失败');
      console.error('Failed to delete report:', error);
    }
  });

  const deleteReport = useCallback(async (id: string) => {
    await deleteReportMutation.mutateAsync(id);
  }, [deleteReportMutation]);

  // Generate report
  const generateReportMutation = useMutation({
    mutationFn: (id: string) => seoService.generateReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-reports'] });
      toast.success('报告生成成功');
    },
    onError: (error) => {
      toast.error('报告生成失败');
      console.error('Failed to generate report:', error);
    }
  });

  const generateReport = useCallback(async (id: string) => {
    await generateReportMutation.mutateAsync(id);
  }, [generateReportMutation]);

  // Schedule report
  const scheduleReportMutation = useMutation({
    mutationFn: ({ id, schedule }: { id: string; schedule: SEOReportSchedule }) =>
      seoService.scheduleReport(id, schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-reports'] });
      toast.success('报告调度设置成功');
    },
    onError: (error) => {
      toast.error('报告调度设置失败');
      console.error('Failed to schedule report:', error);
    }
  });

  const scheduleReport = useCallback(async (id: string, schedule: SEOReportSchedule) => {
    await scheduleReportMutation.mutateAsync({ id, schedule });
  }, [scheduleReportMutation]);

  // Export report
  const exportReportMutation = useMutation({
    mutationFn: ({ id, format }: { id: string; format?: 'pdf' | 'excel' | 'csv' }) =>
      seoService.exportReport(id, format),
    onSuccess: () => {
      toast.success('报告导出成功');
    },
    onError: (error) => {
      toast.error('报告导出失败');
      console.error('Failed to export report:', error);
    }
  });

  const exportReport = useCallback(async (id: string, format?: 'pdf' | 'excel' | 'csv') => {
    await exportReportMutation.mutateAsync({ id, format });
  }, [exportReportMutation]);

  // Get report templates
  const getReportTemplates = useCallback(async (): Promise<SEOReportTemplate[]> => {
    try {
      return await seoService.getReportTemplates();
    } catch (error) {
      toast.error('获取报告模板失败');
      console.error('Failed to get report templates:', error);
      return [];
    }
  }, []);

  // Duplicate report
  const duplicateReportMutation = useMutation({
    mutationFn: (id: string) => seoService.duplicateReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-reports'] });
      toast.success('报告复制成功');
    },
    onError: (error) => {
      toast.error('报告复制失败');
      console.error('Failed to duplicate report:', error);
    }
  });

  const duplicateReport = useCallback(async (id: string) => {
    await duplicateReportMutation.mutateAsync(id);
  }, [duplicateReportMutation]);

  // Pause report
  const pauseReportMutation = useMutation({
    mutationFn: (id: string) => seoService.pauseReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-reports'] });
      toast.success('报告已暂停');
    },
    onError: (error) => {
      toast.error('暂停报告失败');
      console.error('Failed to pause report:', error);
    }
  });

  const pauseReport = useCallback(async (id: string) => {
    await pauseReportMutation.mutateAsync(id);
  }, [pauseReportMutation]);

  // Resume report
  const resumeReportMutation = useMutation({
    mutationFn: (id: string) => seoService.resumeReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-reports'] });
      toast.success('报告已恢复');
    },
    onError: (error) => {
      toast.error('恢复报告失败');
      console.error('Failed to resume report:', error);
    }
  });

  const resumeReport = useCallback(async (id: string) => {
    await resumeReportMutation.mutateAsync(id);
  }, [resumeReportMutation]);

  return {
    reports,
    isLoading,
    error,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    scheduleReport,
    exportReport,
    getReportTemplates,
    duplicateReport,
    pauseReport,
    resumeReport
  };
}