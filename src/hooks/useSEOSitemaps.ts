import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoService } from '@/services/seo';
import { SEOSitemap, SEOSitemapInput } from '@/types/seo.types';
import { toast } from 'sonner';

export const useSEOSitemaps = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-sitemaps'],
    queryFn: seoService.getSitemaps,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });

  const createSitemapMutation = useMutation({
    mutationFn: (sitemap: SEOSitemapInput) => seoService.createSitemap(sitemap),
    onSuccess: (newSitemap: SEOSitemap) => {
      queryClient.setQueryData(['seo-sitemaps'], (old: SEOSitemap[] = []) => [...old, newSitemap]);
      toast.success('站点地图创建成功');
    },
    onError: (error: Error) => {
      toast.error(`站点地图创建失败: ${error.message}`);
    },
  });

  const updateSitemapMutation = useMutation({
    mutationFn: ({ id, sitemap }: { id: string; sitemap: SEOSitemapInput }) => 
      seoService.updateSitemap(id, sitemap),
    onSuccess: (updatedSitemap: SEOSitemap) => {
      queryClient.setQueryData(['seo-sitemaps'], (old: SEOSitemap[] = []) =>
        old.map(s => s.id === updatedSitemap.id ? updatedSitemap : s)
      );
      toast.success('站点地图更新成功');
    },
    onError: (error: Error) => {
      toast.error(`站点地图更新失败: ${error.message}`);
    },
  });

  const deleteSitemapMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteSitemap(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['seo-sitemaps'], (old: SEOSitemap[] = []) =>
        old.filter(s => s.id !== id)
      );
      toast.success('站点地图删除成功');
    },
    onError: (error: Error) => {
      toast.error(`站点地图删除失败: ${error.message}`);
    },
  });

  const generateSitemapMutation = useMutation({
    mutationFn: (urls: string[]) => seoService.generateSitemap(urls),
    onSuccess: (generatedSitemap: SEOSitemap) => {
      queryClient.setQueryData(['seo-sitemaps'], (old: SEOSitemap[] = []) => [...old, generatedSitemap]);
      toast.success('站点地图生成成功');
    },
    onError: (error: Error) => {
      toast.error(`站点地图生成失败: ${error.message}`);
    },
  });

  const submitSitemapMutation = useMutation({
    mutationFn: (id: string) => seoService.submitSitemap(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('站点地图提交成功');
      } else {
        toast.error(`站点地图提交失败: ${result.message}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`站点地图提交失败: ${error.message}`);
    },
  });

  const validateSitemapMutation = useMutation({
    mutationFn: (id: string) => seoService.validateSitemap(id),
    onSuccess: (result) => {
      if (result.isValid) {
        toast.success('站点地图验证通过');
      } else {
        toast.error(`站点地图验证失败: ${result.errors.join(', ')}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`站点地图验证失败: ${error.message}`);
    },
  });

  return {
    sitemaps: data || [],
    isLoading,
    error,
    createSitemap: createSitemapMutation.mutate,
    updateSitemap: updateSitemapMutation.mutate,
    deleteSitemap: deleteSitemapMutation.mutate,
    generateSitemap: generateSitemapMutation.mutate,
    submitSitemap: submitSitemapMutation.mutate,
    validateSitemap: validateSitemapMutation.mutate,
    isCreating: createSitemapMutation.isPending,
    isUpdating: updateSitemapMutation.isPending,
    isDeleting: deleteSitemapMutation.isPending,
    isGenerating: generateSitemapMutation.isPending,
    isSubmitting: submitSitemapMutation.isPending,
    isValidating: validateSitemapMutation.isPending,
  };
};

export const useSEOSitemapTypes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-sitemap-types'],
    queryFn: seoService.getSitemapTypes,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    types: data || [],
    isLoading,
    error,
  };
};

export const useSEOSitemapRules = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-sitemap-rules'],
    queryFn: seoService.getSitemapRules,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const createRuleMutation = useMutation({
    mutationFn: (rule: any) => seoService.createSitemapRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-sitemap-rules'] });
      toast.success('站点地图规则创建成功');
    },
    onError: (error: Error) => {
      toast.error(`站点地图规则创建失败: ${error.message}`);
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, rule }: { id: string; rule: any }) => 
      seoService.updateSitemapRule(id, rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-sitemap-rules'] });
      toast.success('站点地图规则更新成功');
    },
    onError: (error: Error) => {
      toast.error(`站点地图规则更新失败: ${error.message}`);
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteSitemapRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-sitemap-rules'] });
      toast.success('站点地图规则删除成功');
    },
    onError: (error: Error) => {
      toast.error(`站点地图规则删除失败: ${error.message}`);
    },
  });

  return {
    rules: data || [],
    isLoading,
    error,
    createRule: createRuleMutation.mutate,
    updateRule: updateRuleMutation.mutate,
    deleteRule: deleteRuleMutation.mutate,
    isCreating: createRuleMutation.isPending,
    isUpdating: updateRuleMutation.isPending,
    isDeleting: deleteRuleMutation.isPending,
  };
};