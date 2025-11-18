import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoService } from '@/services/seo';
import { SEOCompetitor, SEOCompetitorInput, SEOCompetitorAnalysis } from '@/types/seo.types';
import { toast } from 'sonner';

export const useSEOCompetitors = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-competitors'],
    queryFn: seoService.getCompetitors,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
  });

  const createCompetitorMutation = useMutation({
    mutationFn: (competitor: SEOCompetitorInput) => seoService.createCompetitor(competitor),
    onSuccess: (newCompetitor: SEOCompetitor) => {
      queryClient.setQueryData(['seo-competitors'], (old: SEOCompetitor[] = []) => [...old, newCompetitor]);
      toast.success('竞争对手添加成功');
    },
    onError: (error: Error) => {
      toast.error(`竞争对手添加失败: ${error.message}`);
    },
  });

  const updateCompetitorMutation = useMutation({
    mutationFn: ({ id, competitor }: { id: string; competitor: SEOCompetitorInput }) => 
      seoService.updateCompetitor(id, competitor),
    onSuccess: (updatedCompetitor: SEOCompetitor) => {
      queryClient.setQueryData(['seo-competitors'], (old: SEOCompetitor[] = []) =>
        old.map(c => c.id === updatedCompetitor.id ? updatedCompetitor : c)
      );
      toast.success('竞争对手更新成功');
    },
    onError: (error: Error) => {
      toast.error(`竞争对手更新失败: ${error.message}`);
    },
  });

  const deleteCompetitorMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteCompetitor(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['seo-competitors'], (old: SEOCompetitor[] = []) =>
        old.filter(c => c.id !== id)
      );
      toast.success('竞争对手删除成功');
    },
    onError: (error: Error) => {
      toast.error(`竞争对手删除失败: ${error.message}`);
    },
  });

  const analyzeCompetitorMutation = useMutation({
    mutationFn: (id: string) => seoService.analyzeCompetitor(id),
    onSuccess: (analysis: SEOCompetitorAnalysis) => {
      toast.success('竞争对手分析完成');
    },
    onError: (error: Error) => {
      toast.error(`竞争对手分析失败: ${error.message}`);
    },
  });

  const compareWithCompetitorsMutation = useMutation({
    mutationFn: (urls: string[]) => seoService.compareWithCompetitors(urls),
    onSuccess: (comparison) => {
      toast.success('竞争对手对比分析完成');
    },
    onError: (error: Error) => {
      toast.error(`竞争对手对比分析失败: ${error.message}`);
    },
  });

  return {
    competitors: data || [],
    isLoading,
    error,
    createCompetitor: createCompetitorMutation.mutate,
    updateCompetitor: updateCompetitorMutation.mutate,
    deleteCompetitor: deleteCompetitorMutation.mutate,
    analyzeCompetitor: analyzeCompetitorMutation.mutate,
    compareWithCompetitors: compareWithCompetitorsMutation.mutate,
    isCreating: createCompetitorMutation.isPending,
    isUpdating: updateCompetitorMutation.isPending,
    isDeleting: deleteCompetitorMutation.isPending,
    isAnalyzing: analyzeCompetitorMutation.isPending,
    isComparing: compareWithCompetitorsMutation.isPending,
  };
};

export const useSEOCompetitorKeywords = (competitorId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-competitor-keywords', competitorId],
    queryFn: () => seoService.getCompetitorKeywords(competitorId),
    enabled: !!competitorId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    keywords: data || [],
    isLoading,
    error,
  };
};

export const useSEOCompetitorBacklinks = (competitorId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-competitor-backlinks', competitorId],
    queryFn: () => seoService.getCompetitorBacklinks(competitorId),
    enabled: !!competitorId,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
  });

  return {
    backlinks: data || [],
    isLoading,
    error,
  };
};

export const useSEOCompetitorRankings = (competitorId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-competitor-rankings', competitorId],
    queryFn: () => seoService.getCompetitorRankings(competitorId),
    enabled: !!competitorId,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });

  return {
    rankings: data || [],
    isLoading,
    error,
  };
};

export const useSEOCompetitorDiscovery = (domain: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-competitor-discovery', domain],
    queryFn: () => seoService.discoverCompetitors(domain),
    enabled: !!domain && domain.length >= 3,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return {
    discoveredCompetitors: data || [],
    isLoading,
    error,
  };
};

export const useSEOCompetitorTrends = (competitorIds: string[]) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-competitor-trends', competitorIds],
    queryFn: () => seoService.getCompetitorTrends(competitorIds),
    enabled: competitorIds.length > 0,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
  });

  return {
    trends: data || [],
    isLoading,
    error,
  };
};