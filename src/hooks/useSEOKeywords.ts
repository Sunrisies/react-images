import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoService } from '@/services/seo';
import { SEOKeyword, SEOKeywordInput, SEOKeywordAnalysis } from '@/types/seo.types';
import { toast } from 'sonner';

export const useSEOKeywords = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-keywords'],
    queryFn: seoService.getKeywords,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });

  const createKeywordMutation = useMutation({
    mutationFn: (keyword: SEOKeywordInput) => seoService.createKeyword(keyword),
    onSuccess: (newKeyword: SEOKeyword) => {
      queryClient.setQueryData(['seo-keywords'], (old: SEOKeyword[] = []) => [...old, newKeyword]);
      toast.success('关键词创建成功');
    },
    onError: (error: Error) => {
      toast.error(`关键词创建失败: ${error.message}`);
    },
  });

  const updateKeywordMutation = useMutation({
    mutationFn: ({ id, keyword }: { id: string; keyword: SEOKeywordInput }) => 
      seoService.updateKeyword(id, keyword),
    onSuccess: (updatedKeyword: SEOKeyword) => {
      queryClient.setQueryData(['seo-keywords'], (old: SEOKeyword[] = []) =>
        old.map(k => k.id === updatedKeyword.id ? updatedKeyword : k)
      );
      toast.success('关键词更新成功');
    },
    onError: (error: Error) => {
      toast.error(`关键词更新失败: ${error.message}`);
    },
  });

  const deleteKeywordMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteKeyword(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['seo-keywords'], (old: SEOKeyword[] = []) =>
        old.filter(k => k.id !== id)
      );
      toast.success('关键词删除成功');
    },
    onError: (error: Error) => {
      toast.error(`关键词删除失败: ${error.message}`);
    },
  });

  const analyzeKeywordMutation = useMutation({
    mutationFn: (keyword: string) => seoService.analyzeKeyword(keyword),
    onSuccess: (analysis: SEOKeywordAnalysis) => {
      toast.success('关键词分析完成');
    },
    onError: (error: Error) => {
      toast.error(`关键词分析失败: ${error.message}`);
    },
  });

  const bulkAnalyzeKeywordsMutation = useMutation({
    mutationFn: (keywords: string[]) => seoService.bulkAnalyzeKeywords(keywords),
    onSuccess: (results: SEOKeywordAnalysis[]) => {
      toast.success(`批量分析完成，分析了 ${results.length} 个关键词`);
    },
    onError: (error: Error) => {
      toast.error(`批量分析失败: ${error.message}`);
    },
  });

  const importKeywordsMutation = useMutation({
    mutationFn: (keywords: SEOKeywordInput[]) => seoService.importKeywords(keywords),
    onSuccess: (importedKeywords: SEOKeyword[]) => {
      queryClient.setQueryData(['seo-keywords'], (old: SEOKeyword[] = []) => [...old, ...importedKeywords]);
      toast.success(`成功导入 ${importedKeywords.length} 个关键词`);
    },
    onError: (error: Error) => {
      toast.error(`关键词导入失败: ${error.message}`);
    },
  });

  const exportKeywordsMutation = useMutation({
    mutationFn: (format: 'csv' | 'json' = 'csv') => seoService.exportKeywords(format),
    onSuccess: (data: Blob) => {
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keywords-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('关键词导出成功');
    },
    onError: (error: Error) => {
      toast.error(`关键词导出失败: ${error.message}`);
    },
  });

  return {
    keywords: data || [],
    isLoading,
    error,
    createKeyword: createKeywordMutation.mutate,
    updateKeyword: updateKeywordMutation.mutate,
    deleteKeyword: deleteKeywordMutation.mutate,
    analyzeKeyword: analyzeKeywordMutation.mutate,
    bulkAnalyzeKeywords: bulkAnalyzeKeywordsMutation.mutate,
    importKeywords: importKeywordsMutation.mutate,
    exportKeywords: exportKeywordsMutation.mutate,
    isCreating: createKeywordMutation.isPending,
    isUpdating: updateKeywordMutation.isPending,
    isDeleting: deleteKeywordMutation.isPending,
    isAnalyzing: analyzeKeywordMutation.isPending,
    isBulkAnalyzing: bulkAnalyzeKeywordsMutation.isPending,
    isImporting: importKeywordsMutation.isPending,
    isExporting: exportKeywordsMutation.isPending,
  };
};

export const useSEOKeywordGroups = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-keyword-groups'],
    queryFn: seoService.getKeywordGroups,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createGroupMutation = useMutation({
    mutationFn: (group: { name: string; description?: string }) => seoService.createKeywordGroup(group),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keyword-groups'] });
      toast.success('关键词分组创建成功');
    },
    onError: (error: Error) => {
      toast.error(`关键词分组创建失败: ${error.message}`);
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, group }: { id: string; group: { name: string; description?: string } }) => 
      seoService.updateKeywordGroup(id, group),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keyword-groups'] });
      toast.success('关键词分组更新成功');
    },
    onError: (error: Error) => {
      toast.error(`关键词分组更新失败: ${error.message}`);
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteKeywordGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keyword-groups'] });
      toast.success('关键词分组删除成功');
    },
    onError: (error: Error) => {
      toast.error(`关键词分组删除失败: ${error.message}`);
    },
  });

  return {
    groups: data || [],
    isLoading,
    error,
    createGroup: createGroupMutation.mutate,
    updateGroup: updateGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
};

export const useSEOKeywordSuggestions = (seedKeyword: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-keyword-suggestions', seedKeyword],
    queryFn: () => seoService.getKeywordSuggestions(seedKeyword),
    enabled: !!seedKeyword && seedKeyword.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    suggestions: data || [],
    isLoading,
    error,
  };
};

export const useSEOKeywordDensity = (content: string, keyword: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-keyword-density', content, keyword],
    queryFn: () => seoService.analyzeKeywordDensity(content, keyword),
    enabled: !!content && !!keyword,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    density: data,
    isLoading,
    error,
  };
};