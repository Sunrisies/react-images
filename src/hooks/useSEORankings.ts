import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoService } from '@/services/seo';
import { toast } from 'sonner';
import type { 
  SEORanking, 
  SEORankingFilters, 
  SEORankingTrend,
  SEORankingExportOptions 
} from '@/types/seo.types';

interface UseSEORankingsReturn {
  rankings: SEORanking[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedEngine: string;
  setSelectedEngine: (engine: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  filters: SEORankingFilters;
  setFilters: (filters: SEORankingFilters) => void;
  refreshRankings: () => Promise<void>;
  exportRankings: () => Promise<void>;
  addKeywordTracking: (keyword: string, url: string, options?: any) => Promise<void>;
  removeKeywordTracking: (keywordId: string) => Promise<void>;
  updateKeywordTracking: (keywordId: string, updates: Partial<SEORanking>) => Promise<void>;
  getRankingTrend: (keywordId: string, period: string) => Promise<SEORankingTrend[]>;
  bulkUpdateKeywords: (keywordIds: string[], updates: Partial<SEORanking>) => Promise<void>;
}

const DEFAULT_FILTERS: SEORankingFilters = {
  rankRange: 'all',
  trend: 'all',
  searchVolume: 'all',
  category: 'all',
  location: 'all'
};

export function useSEORankings(): UseSEORankingsReturn {
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('baidu');
  const [dateRange, setDateRange] = useState('30d');
  const [filters, setFilters] = useState<SEORankingFilters>(DEFAULT_FILTERS);

  // Fetch rankings data
  const { data: rankings = [], isLoading, error } = useQuery({
    queryKey: ['seo-rankings', selectedEngine, dateRange, filters],
    queryFn: () => seoService.getRankings({
      engine: selectedEngine,
      dateRange,
      ...filters
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Filter rankings based on search query
  const filteredRankings = useMemo(() => {
    if (!searchQuery.trim()) return rankings;
    
    const query = searchQuery.toLowerCase();
    return rankings.filter(ranking => 
      ranking.keyword.toLowerCase().includes(query) ||
      ranking.url.toLowerCase().includes(query) ||
      ranking.category.toLowerCase().includes(query)
    );
  }, [rankings, searchQuery]);

  // Refresh rankings
  const refreshRankings = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['seo-rankings'] });
      toast.success('排名数据已刷新');
    } catch (error) {
      toast.error('刷新排名数据失败');
      console.error('Failed to refresh rankings:', error);
    }
  }, [queryClient]);

  // Export rankings
  const exportRankings = useCallback(async () => {
    try {
      const exportOptions: SEORankingExportOptions = {
        format: 'csv',
        includeTrends: true,
        dateRange,
        engine: selectedEngine
      };
      
      await seoService.exportRankings(exportOptions);
      toast.success('排名数据导出成功');
    } catch (error) {
      toast.error('导出排名数据失败');
      console.error('Failed to export rankings:', error);
    }
  }, [dateRange, selectedEngine]);

  // Add keyword tracking
  const addKeywordTrackingMutation = useMutation({
    mutationFn: ({ keyword, url, options }: { keyword: string; url: string; options?: any }) =>
      seoService.addKeywordTracking(keyword, url, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-rankings'] });
      toast.success('关键词追踪已添加');
    },
    onError: (error) => {
      toast.error('添加关键词追踪失败');
      console.error('Failed to add keyword tracking:', error);
    }
  });

  const addKeywordTracking = useCallback(async (keyword: string, url: string, options?: any) => {
    await addKeywordTrackingMutation.mutateAsync({ keyword, url, options });
  }, [addKeywordTrackingMutation]);

  // Remove keyword tracking
  const removeKeywordTrackingMutation = useMutation({
    mutationFn: (keywordId: string) => seoService.removeKeywordTracking(keywordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-rankings'] });
      toast.success('关键词追踪已移除');
    },
    onError: (error) => {
      toast.error('移除关键词追踪失败');
      console.error('Failed to remove keyword tracking:', error);
    }
  });

  const removeKeywordTracking = useCallback(async (keywordId: string) => {
    await removeKeywordTrackingMutation.mutateAsync(keywordId);
  }, [removeKeywordTrackingMutation]);

  // Update keyword tracking
  const updateKeywordTrackingMutation = useMutation({
    mutationFn: ({ keywordId, updates }: { keywordId: string; updates: Partial<SEORanking> }) =>
      seoService.updateKeywordTracking(keywordId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-rankings'] });
      toast.success('关键词追踪已更新');
    },
    onError: (error) => {
      toast.error('更新关键词追踪失败');
      console.error('Failed to update keyword tracking:', error);
    }
  });

  const updateKeywordTracking = useCallback(async (keywordId: string, updates: Partial<SEORanking>) => {
    await updateKeywordTrackingMutation.mutateAsync({ keywordId, updates });
  }, [updateKeywordTrackingMutation]);

  // Get ranking trend
  const getRankingTrend = useCallback(async (keywordId: string, period: string): Promise<SEORankingTrend[]> => {
    try {
      return await seoService.getRankingTrend(keywordId, period);
    } catch (error) {
      toast.error('获取排名趋势失败');
      console.error('Failed to get ranking trend:', error);
      return [];
    }
  }, []);

  // Bulk update keywords
  const bulkUpdateKeywordsMutation = useMutation({
    mutationFn: ({ keywordIds, updates }: { keywordIds: string[]; updates: Partial<SEORanking> }) =>
      seoService.bulkUpdateKeywords(keywordIds, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-rankings'] });
      toast.success('批量更新成功');
    },
    onError: (error) => {
      toast.error('批量更新失败');
      console.error('Failed to bulk update keywords:', error);
    }
  });

  const bulkUpdateKeywords = useCallback(async (keywordIds: string[], updates: Partial<SEORanking>) => {
    await bulkUpdateKeywordsMutation.mutateAsync({ keywordIds, updates });
  }, [bulkUpdateKeywordsMutation]);

  return {
    rankings: filteredRankings,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedEngine,
    setSelectedEngine,
    dateRange,
    setDateRange,
    filters,
    setFilters,
    refreshRankings,
    exportRankings,
    addKeywordTracking,
    removeKeywordTracking,
    updateKeywordTracking,
    getRankingTrend,
    bulkUpdateKeywords
  };
}