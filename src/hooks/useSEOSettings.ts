import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoService } from '@/services/seo';
import { SEOSettings, SEOSettingsInput } from '@/types/seo.types';
import { toast } from 'sonner';

export const useSEOSettings = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-settings'],
    queryFn: seoService.getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: SEOSettingsInput) => seoService.updateSettings(settings),
    onSuccess: (updatedSettings: SEOSettings) => {
      queryClient.setQueryData(['seo-settings'], updatedSettings);
      toast.success('SEO设置更新成功');
    },
    onError: (error: Error) => {
      toast.error(`SEO设置更新失败: ${error.message}`);
    },
  });

  const resetSettingsMutation = useMutation({
    mutationFn: () => seoService.resetSettings(),
    onSuccess: (defaultSettings: SEOSettings) => {
      queryClient.setQueryData(['seo-settings'], defaultSettings);
      toast.success('SEO设置已重置为默认值');
    },
    onError: (error: Error) => {
      toast.error(`SEO设置重置失败: ${error.message}`);
    },
  });

  const testRobotsTxtMutation = useMutation({
    mutationFn: (content: string) => seoService.testRobotsTxt(content),
    onSuccess: (result) => {
      if (result.isValid) {
        toast.success('robots.txt 验证通过');
      } else {
        toast.error(`robots.txt 验证失败: ${result.errors.join(', ')}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`robots.txt 测试失败: ${error.message}`);
    },
  });

  return {
    settings: data,
    isLoading,
    error,
    updateSettings: updateSettingsMutation.mutate,
    resetSettings: resetSettingsMutation.mutate,
    testRobotsTxt: testRobotsTxtMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
    isResetting: resetSettingsMutation.isPending,
    isTestingRobots: testRobotsTxtMutation.isPending,
  };
};

export const useSEOSettingsLanguages = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-settings-languages'],
    queryFn: seoService.getSupportedLanguages,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    languages: data || [],
    isLoading,
    error,
  };
};

export const useSEOCrawlSettings = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-crawl-settings'],
    queryFn: seoService.getCrawlSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const updateCrawlSettingsMutation = useMutation({
    mutationFn: (settings: any) => seoService.updateCrawlSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-crawl-settings'] });
      toast.success('爬取设置更新成功');
    },
    onError: (error: Error) => {
      toast.error(`爬取设置更新失败: ${error.message}`);
    },
  });

  return {
    crawlSettings: data,
    isLoading,
    error,
    updateCrawlSettings: updateCrawlSettingsMutation.mutate,
    isUpdating: updateCrawlSettingsMutation.isPending,
  };
};