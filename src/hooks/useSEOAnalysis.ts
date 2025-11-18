import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoService } from '@/services/seo';
import { SEOAnalysis, SEOAnalysisInput, SEOScore, SEORecommendations } from '@/types/seo.types';
import { toast } from 'sonner';

export const useSEOAnalysis = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-analysis'],
    queryFn: seoService.getAnalysis,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
  });

  const createAnalysisMutation = useMutation({
    mutationFn: (analysis: SEOAnalysisInput) => seoService.createAnalysis(analysis),
    onSuccess: (newAnalysis: SEOAnalysis) => {
      queryClient.setQueryData(['seo-analysis'], newAnalysis);
      toast.success('SEO分析创建成功');
    },
    onError: (error: Error) => {
      toast.error(`SEO分析创建失败: ${error.message}`);
    },
  });

  const updateAnalysisMutation = useMutation({
    mutationFn: ({ id, analysis }: { id: string; analysis: SEOAnalysisInput }) => 
      seoService.updateAnalysis(id, analysis),
    onSuccess: (updatedAnalysis: SEOAnalysis) => {
      queryClient.setQueryData(['seo-analysis'], updatedAnalysis);
      toast.success('SEO分析更新成功');
    },
    onError: (error: Error) => {
      toast.error(`SEO分析更新失败: ${error.message}`);
    },
  });

  const deleteAnalysisMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteAnalysis(id),
    onSuccess: () => {
      queryClient.setQueryData(['seo-analysis'], null);
      toast.success('SEO分析删除成功');
    },
    onError: (error: Error) => {
      toast.error(`SEO分析删除失败: ${error.message}`);
    },
  });

  const analyzePageMutation = useMutation({
    mutationFn: (url: string) => seoService.analyzePage(url),
    onSuccess: (analysis: SEOAnalysis) => {
      queryClient.setQueryData(['seo-analysis'], analysis);
      toast.success('页面SEO分析完成');
    },
    onError: (error: Error) => {
      toast.error(`页面SEO分析失败: ${error.message}`);
    },
  });

  const analyzeSiteMutation = useMutation({
    mutationFn: (urls: string[]) => seoService.analyzeSite(urls),
    onSuccess: (analysis: SEOAnalysis) => {
      queryClient.setQueryData(['seo-analysis'], analysis);
      toast.success('网站SEO分析完成');
    },
    onError: (error: Error) => {
      toast.error(`网站SEO分析失败: ${error.message}`);
    },
  });

  return {
    analysis: data,
    isLoading,
    error,
    createAnalysis: createAnalysisMutation.mutate,
    updateAnalysis: updateAnalysisMutation.mutate,
    deleteAnalysis: deleteAnalysisMutation.mutate,
    analyzePage: analyzePageMutation.mutate,
    analyzeSite: analyzeSiteMutation.mutate,
    isCreating: createAnalysisMutation.isPending,
    isUpdating: updateAnalysisMutation.isPending,
    isDeleting: deleteAnalysisMutation.isPending,
    isAnalyzingPage: analyzePageMutation.isPending,
    isAnalyzingSite: analyzeSiteMutation.isPending,
  };
};

export const useSEOScore = (url?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-score', url],
    queryFn: () => seoService.getSEOScore(url),
    enabled: !!url,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    score: data,
    isLoading,
    error,
  };
};

export const useSEORecommendations = (analysisId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-recommendations', analysisId],
    queryFn: () => seoService.getRecommendations(analysisId),
    enabled: !!analysisId,
    staleTime: 20 * 60 * 1000, // 20 minutes
  });

  return {
    recommendations: data,
    isLoading,
    error,
  };
};

export const useSEOMobileAnalysis = (url: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-mobile-analysis', url],
    queryFn: () => seoService.analyzeMobileSEO(url),
    enabled: !!url,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    mobileAnalysis: data,
    isLoading,
    error,
  };
};

export const useSEOPageSpeedAnalysis = (url: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-page-speed', url],
    queryFn: () => seoService.analyzePageSpeed(url),
    enabled: !!url,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    pageSpeed: data,
    isLoading,
    error,
  };
};

export const useSEOContentAnalysis = (content: string, keywords: string[]) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-content-analysis', content, keywords],
    queryFn: () => seoService.analyzeContent(content, keywords),
    enabled: !!content && content.length >= 100 && keywords.length > 0,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    contentAnalysis: data,
    isLoading,
    error,
  };
};