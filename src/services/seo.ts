import { 
  SEOSettings, 
  SEOKeyword, 
  SEOMetaTags, 
  SEOSitemap,
  SEOAnalysis,
  SEOCompetitor,
  SEORanking,
  SEORedirect,
  SEOLink,
  SEOReport,
  SEOApiResponse,
  SEOKeywordFilter,
  SEOAnalysisFilter,
  SEORankingFilter,
  KeywordPerformance
} from '@/types/seo.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// API 基础配置
const API_BASE_URL = '/api/seo';

// 工具函数
const fetchWithError = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// SEO 设置相关 API
export const useSEOSettings = () => {
  return useQuery({
    queryKey: ['seo-settings'],
    queryFn: async (): Promise<SEOSettings> => {
      const data = await fetchWithError(`${API_BASE_URL}/settings`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

export const useUpdateSEOSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: SEOSettings): Promise<SEOSettings> => {
      const data = await fetchWithError(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['seo-settings'], data);
      toast.success('SEO设置已更新');
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
};

// 关键词管理相关 API
export const useSEOKeywords = (filter?: SEOKeywordFilter) => {
  return useQuery({
    queryKey: ['seo-keywords', filter],
    queryFn: async (): Promise<{ data: SEOKeyword[]; pagination?: any }> => {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const data = await fetchWithError(`${API_BASE_URL}/keywords?${params}`);
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2分钟
  });
};

export const useCreateSEOKeyword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyword: Omit<SEOKeyword, 'id'>): Promise<SEOKeyword> => {
      const data = await fetchWithError(`${API_BASE_URL}/keywords`, {
        method: 'POST',
        body: JSON.stringify(keyword),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keywords'] });
      toast.success('关键词已创建');
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });
};

export const useUpdateSEOKeyword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyword: SEOKeyword): Promise<SEOKeyword> => {
      const data = await fetchWithError(`${API_BASE_URL}/keywords/${keyword.id}`, {
        method: 'PUT',
        body: JSON.stringify(keyword),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keywords'] });
      toast.success('关键词已更新');
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
};

export const useDeleteSEOKeyword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await fetchWithError(`${API_BASE_URL}/keywords/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keywords'] });
      toast.success('关键词已删除');
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });
};

export const useAnalyzeKeywords = () => {
  return useMutation({
    mutationFn: async (content: string): Promise<{ keywords: SEOKeyword[]; density: Record<string, number> }> => {
      const data = await fetchWithError(`${API_BASE_URL}/keywords/analyze`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      return data.data;
    },
    onError: (error) => {
      toast.error(`关键词分析失败: ${error.message}`);
    },
  });
};

// Meta 标签管理相关 API
export const useSEOMetaTags = (pageId?: string) => {
  return useQuery({
    queryKey: ['seo-meta-tags', pageId],
    queryFn: async (): Promise<{ data: SEOMetaTags[]; pagination?: any }> => {
      const params = pageId ? `?pageId=${pageId}` : '';
      const data = await fetchWithError(`${API_BASE_URL}/meta-tags${params}`);
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2分钟
  });
};

export const useCreateSEOMetaTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metaTags: Omit<SEOMetaTags, 'id'>): Promise<SEOMetaTags> => {
      const data = await fetchWithError(`${API_BASE_URL}/meta-tags`, {
        method: 'POST',
        body: JSON.stringify(metaTags),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-meta-tags'] });
      toast.success('Meta标签已创建');
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });
};

export const useUpdateSEOMetaTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metaTags: SEOMetaTags): Promise<SEOMetaTags> => {
      const data = await fetchWithError(`${API_BASE_URL}/meta-tags/${metaTags.id}`, {
        method: 'PUT',
        body: JSON.stringify(metaTags),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-meta-tags'] });
      toast.success('Meta标签已更新');
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
};

export const useGenerateMetaTags = () => {
  return useMutation({
    mutationFn: async (params: { content: string; keywords: string[]; title?: string }): Promise<SEOMetaTags> => {
      const data = await fetchWithError(`${API_BASE_URL}/meta-tags/generate`, {
        method: 'POST',
        body: JSON.stringify(params),
      });
      return data.data;
    },
    onError: (error) => {
      toast.error(`生成失败: ${error.message}`);
    },
  });
};

// 站点地图相关 API
export const useSEOSitemaps = () => {
  return useQuery({
    queryKey: ['seo-sitemaps'],
    queryFn: async (): Promise<{ data: SEOSitemap[]; pagination?: any }> => {
      const data = await fetchWithError(`${API_BASE_URL}/sitemaps`);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

export const useGenerateSitemap = () => {
  return useMutation({
    mutationFn: async (type: 'xml' | 'html' | 'news' | 'video' = 'xml'): Promise<string> => {
      const data = await fetchWithError(`${API_BASE_URL}/sitemaps/generate`, {
        method: 'POST',
        body: JSON.stringify({ type }),
      });
      return data.data;
    },
    onSuccess: () => {
      toast.success('站点地图已生成');
    },
    onError: (error) => {
      toast.error(`生成失败: ${error.message}`);
    },
  });
};

export const useSubmitSitemap = () => {
  return useMutation({
    mutationFn: async (searchEngines: string[]): Promise<void> => {
      await fetchWithError(`${API_BASE_URL}/sitemaps/submit`, {
        method: 'POST',
        body: JSON.stringify({ searchEngines }),
      });
    },
    onSuccess: () => {
      toast.success('站点地图已提交');
    },
    onError: (error) => {
      toast.error(`提交失败: ${error.message}`);
    },
  });
};

// SEO 分析相关 API
export const useSEOAnalysis = (filter?: SEOAnalysisFilter) => {
  return useQuery({
    queryKey: ['seo-analysis', filter],
    queryFn: async (): Promise<{ data: SEOAnalysis[]; pagination?: any }> => {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const data = await fetchWithError(`${API_BASE_URL}/analysis?${params}`);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

export const useAnalyzePage = () => {
  return useMutation({
    mutationFn: async (pageId: string): Promise<SEOAnalysis> => {
      const data = await fetchWithError(`${API_BASE_URL}/analysis/${pageId}`, {
        method: 'POST',
      });
      return data.data;
    },
    onSuccess: () => {
      toast.success('页面分析完成');
    },
    onError: (error) => {
      toast.error(`分析失败: ${error.message}`);
    },
  });
};

export const useBulkSEOAnalysis = () => {
  return useMutation({
    mutationFn: async (pageIds: string[]): Promise<SEOAnalysis[]> => {
      const data = await fetchWithError(`${API_BASE_URL}/analysis/bulk`, {
        method: 'POST',
        body: JSON.stringify({ pageIds }),
      });
      return data.data;
    },
    onSuccess: (results) => {
      toast.success(`已完成 ${results.length} 个页面的分析`);
    },
    onError: (error) => {
      toast.error(`批量分析失败: ${error.message}`);
    },
  });
};

// 竞争对手分析相关 API
export const useSEOCompetitors = () => {
  return useQuery({
    queryKey: ['seo-competitors'],
    queryFn: async (): Promise<{ data: SEOCompetitor[]; pagination?: any }> => {
      const data = await fetchWithError(`${API_BASE_URL}/competitors`);
      return data;
    },
    staleTime: 60 * 60 * 1000, // 1小时
  });
};

export const useCreateSEOCompetitor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (competitor: Omit<SEOCompetitor, 'id'>): Promise<SEOCompetitor> => {
      const data = await fetchWithError(`${API_BASE_URL}/competitors`, {
        method: 'POST',
        body: JSON.stringify(competitor),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-competitors'] });
      toast.success('竞争对手已添加');
    },
    onError: (error) => {
      toast.error(`添加失败: ${error.message}`);
    },
  });
};

export const useAnalyzeCompetitor = () => {
  return useMutation({
    mutationFn: async (competitorId: string): Promise<SEOCompetitor> => {
      const data = await fetchWithError(`${API_BASE_URL}/competitors/${competitorId}/analyze`, {
        method: 'POST',
      });
      return data.data;
    },
    onSuccess: () => {
      toast.success('竞争对手分析完成');
    },
    onError: (error) => {
      toast.error(`分析失败: ${error.message}`);
    },
  });
};

// 排名追踪相关 API
export const useSEORankings = (filter?: SEORankingFilter) => {
  return useQuery({
    queryKey: ['seo-rankings', filter],
    queryFn: async (): Promise<{ data: SEORanking[]; pagination?: any }> => {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const data = await fetchWithError(`${API_BASE_URL}/rankings?${params}`);
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30分钟
  });
};

// 重定向管理相关 API
export const useSEORedirects = () => {
  return useQuery({
    queryKey: ['seo-redirects'],
    queryFn: async (): Promise<{ data: SEORedirect[]; pagination?: any }> => {
      const data = await fetchWithError(`${API_BASE_URL}/redirects`);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10分钟
  });
};

export const useCreateSEORedirect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (redirect: Omit<SEORedirect, 'id'>): Promise<SEORedirect> => {
      const data = await fetchWithError(`${API_BASE_URL}/redirects`, {
        method: 'POST',
        body: JSON.stringify(redirect),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-redirects'] });
      toast.success('重定向已创建');
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });
};

// 链接管理相关 API
export const useSEOLinks = (pageId?: string) => {
  return useQuery({
    queryKey: ['seo-links', pageId],
    queryFn: async (): Promise<{ data: SEOLink[]; pagination?: any }> => {
      const params = pageId ? `?pageId=${pageId}` : '';
      const data = await fetchWithError(`${API_BASE_URL}/links${params}`);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

// 报告生成相关 API
export const useSEOReports = () => {
  return useQuery({
    queryKey: ['seo-reports'],
    queryFn: async (): Promise<{ data: SEOReport[]; pagination?: any }> => {
      const data = await fetchWithError(`${API_BASE_URL}/reports`);
      return data;
    },
    staleTime: 60 * 60 * 1000, // 1小时
  });
};

export const useGenerateSEOReport = () => {
  return useMutation({
    mutationFn: async (params: { type: string; dateRange: { start: string; end: string } }): Promise<SEOReport> => {
      const data = await fetchWithError(`${API_BASE_URL}/reports/generate`, {
        method: 'POST',
        body: JSON.stringify(params),
      });
      return data.data;
    },
    onSuccess: () => {
      toast.success('SEO报告已生成');
    },
    onError: (error) => {
      toast.error(`生成失败: ${error.message}`);
    },
  });
};

// 传统服务 API 对象 (用于测试和非 React 场景)
export const seoService = {
  // SEO 设置
  getSettings: async (): Promise<SEOSettings> => {
    const data = await fetchWithError(`${API_BASE_URL}/settings`);
    return data.data;
  },
  
  updateSettings: async (settings: SEOSettings): Promise<SEOSettings> => {
    const data = await fetchWithError(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return data.data;
  },

  // 关键词管理
  getKeywords: async (filter?: SEOKeywordFilter): Promise<{ data: SEOKeyword[]; pagination?: any }> => {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const data = await fetchWithError(`${API_BASE_URL}/keywords?${params}`);
    return data;
  },
  
  createKeyword: async (keyword: Omit<SEOKeyword, 'id'>): Promise<SEOKeyword> => {
    const data = await fetchWithError(`${API_BASE_URL}/keywords`, {
      method: 'POST',
      body: JSON.stringify(keyword),
    });
    return data.data;
  },
  
  updateKeyword: async (id: string, keyword: Partial<SEOKeyword>): Promise<SEOKeyword> => {
    const data = await fetchWithError(`${API_BASE_URL}/keywords/${id}`, {
      method: 'PUT',
      body: JSON.stringify(keyword),
    });
    return data.data;
  },
  
  deleteKeyword: async (id: string): Promise<boolean> => {
    await fetchWithError(`${API_BASE_URL}/keywords/${id}`, {
      method: 'DELETE',
    });
    return true;
  },
  
  analyzeKeyword: async (content: string): Promise<{ keywords: SEOKeyword[]; density: Record<string, number> }> => {
    const data = await fetchWithError(`${API_BASE_URL}/keywords/analyze`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return data.data;
  },

  // 站点地图
  getSitemaps: async (): Promise<{ data: SEOSitemap[]; pagination?: any }> => {
    const data = await fetchWithError(`${API_BASE_URL}/sitemaps`);
    return data;
  },
  
  generateSitemap: async (type: 'xml' | 'html' | 'news' | 'video' = 'xml'): Promise<SEOSitemap> => {
    const data = await fetchWithError(`${API_BASE_URL}/sitemaps/generate`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
    return data.data;
  },
  
  submitSitemap: async (sitemapId: string): Promise<boolean> => {
    await fetchWithError(`${API_BASE_URL}/sitemaps/submit`, {
      method: 'POST',
      body: JSON.stringify({ searchEngines: ['google', 'bing'] }),
    });
    return true;
  },

  // Meta 标签
  getMetaTags: async (pageId?: string): Promise<{ data: SEOMetaTags[]; pagination?: any }> => {
    const params = pageId ? `?pageId=${pageId}` : '';
    const data = await fetchWithError(`${API_BASE_URL}/meta-tags${params}`);
    return data;
  },
  
  updateMetaTags: async (id: string, metaTags: SEOMetaTags): Promise<SEOMetaTags> => {
    const data = await fetchWithError(`${API_BASE_URL}/meta-tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(metaTags),
    });
    return data.data;
  },

  // 链接管理
  getLinks: async (pageId?: string): Promise<{ data: SEOLink[]; pagination?: any }> => {
    const params = pageId ? `?pageId=${pageId}` : '';
    const data = await fetchWithError(`${API_BASE_URL}/links${params}`);
    return data;
  },
  
  analyzeLinks: async (pageId?: string): Promise<{
    brokenLinks: SEOLink[];
    internalLinks: SEOLink[];
    externalLinks: SEOLink[];
    suggestions: string[];
  }> => {
    const params = pageId ? `?pageId=${pageId}` : '';
    const data = await fetchWithError(`${API_BASE_URL}/links/analyze${params}`);
    return data.data;
  },

  // SEO 分析
  getSEOScore: async (url: string): Promise<SEOAnalysis> => {
    const data = await fetchWithError(`${API_BASE_URL}/analysis/score?url=${encodeURIComponent(url)}`);
    return data.data;
  },
  
  analyzePage: async (pageId: string): Promise<SEOAnalysis> => {
    const data = await fetchWithError(`${API_BASE_URL}/analysis/${pageId}`, {
      method: 'POST',
    });
    return data.data;
  },

  // 竞争对手分析
  getCompetitors: async (): Promise<{ data: SEOCompetitor[]; pagination?: any }> => {
    const data = await fetchWithError(`${API_BASE_URL}/competitors`);
    return data;
  },
  
  addCompetitor: async (competitor: Omit<SEOCompetitor, 'id'>): Promise<SEOCompetitor> => {
    const data = await fetchWithError(`${API_BASE_URL}/competitors`, {
      method: 'POST',
      body: JSON.stringify(competitor),
    });
    return data.data;
  },
  
  analyzeCompetitor: async (id: string): Promise<SEOCompetitor> => {
    const data = await fetchWithError(`${API_BASE_URL}/competitors/${id}/analyze`, {
      method: 'POST',
    });
    return data.data;
  },

  // 排名追踪
  getRankings: async (filter?: SEORankingFilter): Promise<{ data: SEORanking[]; pagination?: any }> => {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const data = await fetchWithError(`${API_BASE_URL}/rankings?${params}`);
    return data;
  },
  
  trackRanking: async (params: { keyword: string; url: string; searchEngine: string }): Promise<SEORanking> => {
    const data = await fetchWithError(`${API_BASE_URL}/rankings/track`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return data.data;
  },
};

// 工具函数
export const useSEOHealthCheck = () => {
  return useMutation({
    mutationFn: async (): Promise<{
      overallScore: number;
      issues: any[];
      recommendations: string[];
    }> => {
      const data = await fetchWithError(`${API_BASE_URL}/health-check`, {
        method: 'POST',
      });
      return data.data;
    },
    onSuccess: (result) => {
      if (result.overallScore >= 80) {
        toast.success(`SEO健康度: ${result.overallScore}%`);
      } else if (result.overallScore >= 60) {
        toast.warning(`SEO健康度: ${result.overallScore}%`);
      } else {
        toast.error(`SEO健康度: ${result.overallScore}%`);
      }
    },
    onError: (error) => {
      toast.error(`健康检查失败: ${error.message}`);
    },
  });
};

// 关键词建议
export const useKeywordSuggestions = () => {
  return useMutation({
    mutationFn: async (seedKeyword: string): Promise<SEOKeyword[]> => {
      const data = await fetchWithError(`${API_BASE_URL}/keywords/suggestions`, {
        method: 'POST',
        body: JSON.stringify({ seedKeyword }),
      });
      return data.data;
    },
    onError: (error) => {
      toast.error(`关键词建议失败: ${error.message}`);
    },
  });
};

// 批量操作
export const useBulkSEOOperations = () => {
  return useMutation({
    mutationFn: async (operations: {
      type: 'keywords' | 'meta-tags' | 'redirects';
      action: 'create' | 'update' | 'delete';
      items: any[];
    }): Promise<{ success: number; failed: number; errors: string[] }> => {
      const data = await fetchWithError(`${API_BASE_URL}/bulk-operations`, {
        method: 'POST',
        body: JSON.stringify(operations),
      });
      return data.data;
    },
    onSuccess: (result) => {
      toast.success(`批量操作完成: ${result.success}成功, ${result.failed}失败`);
      if (result.errors.length > 0) {
        console.warn('批量操作错误:', result.errors);
      }
    },
    onError: (error) => {
      toast.error(`批量操作失败: ${error.message}`);
    },
  });
};