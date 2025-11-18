import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoService } from '@/services/seo';
import { SEOLink, SEOLinkInput, SEOLinkAnalysis } from '@/types/seo.types';
import { toast } from 'sonner';

export const useSEOLinks = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-links'],
    queryFn: seoService.getLinks,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });

  const createLinkMutation = useMutation({
    mutationFn: (link: SEOLinkInput) => seoService.createLink(link),
    onSuccess: (newLink: SEOLink) => {
      queryClient.setQueryData(['seo-links'], (old: SEOLink[] = []) => [...old, newLink]);
      toast.success('链接创建成功');
    },
    onError: (error: Error) => {
      toast.error(`链接创建失败: ${error.message}`);
    },
  });

  const updateLinkMutation = useMutation({
    mutationFn: ({ id, link }: { id: string; link: SEOLinkInput }) => 
      seoService.updateLink(id, link),
    onSuccess: (updatedLink: SEOLink) => {
      queryClient.setQueryData(['seo-links'], (old: SEOLink[] = []) =>
        old.map(l => l.id === updatedLink.id ? updatedLink : l)
      );
      toast.success('链接更新成功');
    },
    onError: (error: Error) => {
      toast.error(`链接更新失败: ${error.message}`);
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteLink(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['seo-links'], (old: SEOLink[] = []) =>
        old.filter(l => l.id !== id)
      );
      toast.success('链接删除成功');
    },
    onError: (error: Error) => {
      toast.error(`链接删除失败: ${error.message}`);
    },
  });

  const analyzeLinkMutation = useMutation({
    mutationFn: (url: string) => seoService.analyzeLink(url),
    onSuccess: (analysis: SEOLinkAnalysis) => {
      toast.success('链接分析完成');
    },
    onError: (error: Error) => {
      toast.error(`链接分析失败: ${error.message}`);
    },
  });

  const checkBrokenLinksMutation = useMutation({
    mutationFn: (urls: string[]) => seoService.checkBrokenLinks(urls),
    onSuccess: (results) => {
      const brokenCount = results.filter(r => !r.isValid).length;
      toast.success(`死链检测完成，发现 ${brokenCount} 个死链`);
    },
    onError: (error: Error) => {
      toast.error(`死链检测失败: ${error.message}`);
    },
  });

  return {
    links: data || [],
    isLoading,
    error,
    createLink: createLinkMutation.mutate,
    updateLink: updateLinkMutation.mutate,
    deleteLink: deleteLinkMutation.mutate,
    analyzeLink: analyzeLinkMutation.mutate,
    checkBrokenLinks: checkBrokenLinksMutation.mutate,
    isCreating: createLinkMutation.isPending,
    isUpdating: updateLinkMutation.isPending,
    isDeleting: deleteLinkMutation.isPending,
    isAnalyzing: analyzeLinkMutation.isPending,
    isCheckingBrokenLinks: checkBrokenLinksMutation.isPending,
  };
};

export const useSEOInternalLinkSuggestions = (content: string, currentUrl: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-internal-link-suggestions', content, currentUrl],
    queryFn: () => seoService.getInternalLinkSuggestions(content, currentUrl),
    enabled: !!content && content.length >= 100,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    suggestions: data || [],
    isLoading,
    error,
  };
};

export const useSEOExternalLinkManagement = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-external-links'],
    queryFn: seoService.getExternalLinks,
    staleTime: 20 * 60 * 1000, // 20 minutes
  });

  const updateExternalLinkSettingsMutation = useMutation({
    mutationFn: (settings: { nofollowExternal: boolean; openInNewTab: boolean }) => 
      seoService.updateExternalLinkSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-external-links'] });
      toast.success('外部链接设置更新成功');
    },
    onError: (error: Error) => {
      toast.error(`外部链接设置更新失败: ${error.message}`);
    },
  });

  return {
    externalLinks: data || [],
    isLoading,
    error,
    updateExternalLinkSettings: updateExternalLinkSettingsMutation.mutate,
    isUpdating: updateExternalLinkSettingsMutation.isPending,
  };
};

export const useSEOLinkRedirects = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-link-redirects'],
    queryFn: seoService.getRedirects,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  const createRedirectMutation = useMutation({
    mutationFn: (redirect: { from: string; to: string; type: 301 | 302 }) => 
      seoService.createRedirect(redirect),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-link-redirects'] });
      toast.success('重定向创建成功');
    },
    onError: (error: Error) => {
      toast.error(`重定向创建失败: ${error.message}`);
    },
  });

  const updateRedirectMutation = useMutation({
    mutationFn: ({ id, redirect }: { id: string; redirect: { from: string; to: string; type: 301 | 302 } }) => 
      seoService.updateRedirect(id, redirect),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-link-redirects'] });
      toast.success('重定向更新成功');
    },
    onError: (error: Error) => {
      toast.error(`重定向更新失败: ${error.message}`);
    },
  });

  const deleteRedirectMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteRedirect(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-link-redirects'] });
      toast.success('重定向删除成功');
    },
    onError: (error: Error) => {
      toast.error(`重定向删除失败: ${error.message}`);
    },
  });

  return {
    redirects: data || [],
    isLoading,
    error,
    createRedirect: createRedirectMutation.mutate,
    updateRedirect: updateRedirectMutation.mutate,
    deleteRedirect: deleteRedirectMutation.mutate,
    isCreating: createRedirectMutation.isPending,
    isUpdating: updateRedirectMutation.isPending,
    isDeleting: deleteRedirectMutation.isPending,
  };
};