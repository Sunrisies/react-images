import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoService } from '@/services/seo';
import { SEOMetaTags, SEOMetaTagsInput } from '@/types/seo.types';
import { toast } from 'sonner';

export const useSEOMetaTags = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-meta-tags'],
    queryFn: seoService.getMetaTags,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  const createMetaTagsMutation = useMutation({
    mutationFn: (metaTags: SEOMetaTagsInput) => seoService.createMetaTags(metaTags),
    onSuccess: (newMetaTags: SEOMetaTags) => {
      queryClient.setQueryData(['seo-meta-tags'], (old: SEOMetaTags[] = []) => [...old, newMetaTags]);
      toast.success('Meta标签创建成功');
    },
    onError: (error: Error) => {
      toast.error(`Meta标签创建失败: ${error.message}`);
    },
  });

  const updateMetaTagsMutation = useMutation({
    mutationFn: ({ id, metaTags }: { id: string; metaTags: SEOMetaTagsInput }) => 
      seoService.updateMetaTags(id, metaTags),
    onSuccess: (updatedMetaTags: SEOMetaTags) => {
      queryClient.setQueryData(['seo-meta-tags'], (old: SEOMetaTags[] = []) =>
        old.map(m => m.id === updatedMetaTags.id ? updatedMetaTags : m)
      );
      toast.success('Meta标签更新成功');
    },
    onError: (error: Error) => {
      toast.error(`Meta标签更新失败: ${error.message}`);
    },
  });

  const deleteMetaTagsMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteMetaTags(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['seo-meta-tags'], (old: SEOMetaTags[] = []) =>
        old.filter(m => m.id !== id)
      );
      toast.success('Meta标签删除成功');
    },
    onError: (error: Error) => {
      toast.error(`Meta标签删除失败: ${error.message}`);
    },
  });

  const generateMetaTagsMutation = useMutation({
    mutationFn: ({ content, pageUrl }: { content: string; pageUrl: string }) => 
      seoService.generateMetaTags(content, pageUrl),
    onSuccess: (generatedMetaTags: SEOMetaTags) => {
      queryClient.setQueryData(['seo-meta-tags'], (old: SEOMetaTags[] = []) => [...old, generatedMetaTags]);
      toast.success('Meta标签自动生成成功');
    },
    onError: (error: Error) => {
      toast.error(`Meta标签自动生成失败: ${error.message}`);
    },
  });

  const validateMetaTagsMutation = useMutation({
    mutationFn: (id: string) => seoService.validateMetaTags(id),
    onSuccess: (result) => {
      if (result.isValid) {
        toast.success('Meta标签验证通过');
      } else {
        toast.error(`Meta标签验证失败: ${result.errors.join(', ')}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Meta标签验证失败: ${error.message}`);
    },
  });

  const duplicateMetaTagsMutation = useMutation({
    mutationFn: (id: string) => seoService.duplicateMetaTags(id),
    onSuccess: (duplicatedMetaTags: SEOMetaTags) => {
      queryClient.setQueryData(['seo-meta-tags'], (old: SEOMetaTags[] = []) => [...old, duplicatedMetaTags]);
      toast.success('Meta标签复制成功');
    },
    onError: (error: Error) => {
      toast.error(`Meta标签复制失败: ${error.message}`);
    },
  });

  return {
    metaTags: data || [],
    isLoading,
    error,
    createMetaTags: createMetaTagsMutation.mutate,
    updateMetaTags: updateMetaTagsMutation.mutate,
    deleteMetaTags: deleteMetaTagsMutation.mutate,
    generateMetaTags: generateMetaTagsMutation.mutate,
    validateMetaTags: validateMetaTagsMutation.mutate,
    duplicateMetaTags: duplicateMetaTagsMutation.mutate,
    isCreating: createMetaTagsMutation.isPending,
    isUpdating: updateMetaTagsMutation.isPending,
    isDeleting: deleteMetaTagsMutation.isPending,
    isGenerating: generateMetaTagsMutation.isPending,
    isValidating: validateMetaTagsMutation.isPending,
    isDuplicating: duplicateMetaTagsMutation.isPending,
  };
};

export const useSEOMetaTagTemplates = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-meta-tag-templates'],
    queryFn: seoService.getMetaTagTemplates,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const createTemplateMutation = useMutation({
    mutationFn: (template: any) => seoService.createMetaTagTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-meta-tag-templates'] });
      toast.success('Meta标签模板创建成功');
    },
    onError: (error: Error) => {
      toast.error(`Meta标签模板创建失败: ${error.message}`);
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, template }: { id: string; template: any }) => 
      seoService.updateMetaTagTemplate(id, template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-meta-tag-templates'] });
      toast.success('Meta标签模板更新成功');
    },
    onError: (error: Error) => {
      toast.error(`Meta标签模板更新失败: ${error.message}`);
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => seoService.deleteMetaTagTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-meta-tag-templates'] });
      toast.success('Meta标签模板删除成功');
    },
    onError: (error: Error) => {
      toast.error(`Meta标签模板删除失败: ${error.message}`);
    },
  });

  return {
    templates: data || [],
    isLoading,
    error,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending,
  };
};

export const useSEOMetaTagPreview = (metaTags: SEOMetaTagsInput) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seo-meta-tag-preview', metaTags],
    queryFn: () => seoService.previewMetaTags(metaTags),
    enabled: !!metaTags.title || !!metaTags.description,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    preview: data,
    isLoading,
    error,
  };
};