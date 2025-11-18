import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { seoService } from '../../services/seo';
import { useSEOSettings } from '../../hooks/useSEOSettings';
import { useSEOKeywords } from '../../hooks/useSEOKeywords';
import { useSEOSitemaps } from '../../hooks/useSEOSitemaps';
import { useSEOMetaTags } from '../../hooks/useSEOMetaTags';
import { useSEOAnalysis } from '../../hooks/useSEOAnalysis';

// Mock fetch API
global.fetch = vi.fn();

// Mock toast notifications
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('SEO System Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  describe('Complete SEO Workflow', () => {
    it('should handle complete SEO setup workflow', async () => {
      // Mock initial empty state
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: null }) }) // Settings
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) }) // Keywords
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) }) // Sitemaps
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) }) // Meta tags
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: null }) }); // Analysis

      const { result: settingsResult } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });
      const { result: keywordsResult } = renderHook(() => useSEOKeywords(), { wrapper: createWrapper() });
      const { result: sitemapsResult } = renderHook(() => useSEOSitemaps(), { wrapper: createWrapper() });
      const { result: metaTagsResult } = renderHook(() => useSEOMetaTags(), { wrapper: createWrapper() });
      const { result: analysisResult } = renderHook(() => useSEOAnalysis(), { wrapper: createWrapper() });

      // Wait for all initial data to load
      await waitFor(() => {
        expect(settingsResult.current.settingsQuery.isSuccess).toBe(true);
        expect(keywordsResult.current.keywordsQuery.isSuccess).toBe(true);
        expect(sitemapsResult.current.sitemapsQuery.isSuccess).toBe(true);
        expect(metaTagsResult.current.metaTagsQuery.isSuccess).toBe(true);
        expect(analysisResult.current.analysisQuery.isSuccess).toBe(true);
      });

      // Verify initial empty state
      expect(settingsResult.current.settingsQuery.data).toBeNull();
      expect(keywordsResult.current.keywordsQuery.data).toEqual([]);
      expect(sitemapsResult.current.sitemapsQuery.data).toEqual([]);
      expect(metaTagsResult.current.metaTagsQuery.data).toEqual([]);
      expect(analysisResult.current.analysisQuery.data).toBeNull();
    });

    it('should handle SEO settings configuration', async () => {
      const mockSettings = {
        id: '1',
        siteName: 'Test Blog',
        siteDescription: 'A test blog for SEO',
        siteUrl: 'https://testblog.com',
        defaultLanguage: 'zh-CN',
        enableMultilingual: true,
        metaTitleTemplate: '{title} | {siteName}',
        metaDescriptionTemplate: '{description}',
        robotsTxt: 'User-agent: *\nAllow: /',
        crawlDelay: 1,
        enableCrawlDelay: false,
        sitemapAutoSubmit: true,
        enableAMP: false,
        googleAnalyticsId: 'UA-123456789',
        baiduAnalyticsId: 'baidu-123',
        enableJsonLd: true,
        enableOpenGraph: true,
        enableTwitterCard: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock settings creation
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockSettings }) }) // Settings fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockSettings }) }); // Settings update

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.settingsQuery.isSuccess).toBe(true);
      });

      // Update settings
      const updatedSettings = { ...mockSettings, siteName: 'Updated Blog' };
      result.current.updateSettingsMutation.mutate(updatedSettings);

      await waitFor(() => {
        expect(result.current.updateSettingsMutation.isSuccess).toBe(true);
      });

      expect(result.current.updateSettingsMutation.data?.siteName).toBe('Updated Blog');
    });

    it('should handle keyword research and management', async () => {
      const mockKeywords = [
        {
          id: '1',
          keyword: 'test keyword',
          density: 2.5,
          competition: 'medium',
          searchVolume: 1000,
          cpc: 1.5,
          trends: [100, 120, 110, 130],
          category: 'test',
          tags: ['primary'],
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Mock keyword operations
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockKeywords }) }) // Fetch keywords
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockKeywords }) }) // Create keyword
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: ['suggestion1', 'suggestion2'] }) }); // Suggestions

      const { result } = renderHook(() => useSEOKeywords(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.keywordsQuery.isSuccess).toBe(true);
      });

      expect(result.current.keywordsQuery.data).toEqual(mockKeywords);

      // Create new keyword
      const newKeyword = { keyword: 'new keyword', category: 'test' };
      result.current.createKeywordMutation.mutate(newKeyword);

      await waitFor(() => {
        expect(result.current.createKeywordMutation.isSuccess).toBe(true);
      });

      // Get keyword suggestions
      const suggestions = await result.current.getKeywordSuggestions('test');
      expect(suggestions).toEqual(['suggestion1', 'suggestion2']);
    });

    it('should handle sitemap generation and management', async () => {
      const mockSitemap = {
        id: '1',
        name: 'Main Sitemap',
        url: '/sitemap.xml',
        type: 'xml',
        entries: 100,
        size: 1024,
        lastGenerated: new Date().toISOString(),
        autoSubmit: true,
        searchEngines: ['google', 'bing'],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock sitemap operations
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [mockSitemap] }) }) // Fetch sitemaps
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockSitemap }) }) // Generate sitemap
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { success: true, submitted: ['google'] } }) }); // Submit sitemap

      const { result } = renderHook(() => useSEOSitemaps(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.sitemapsQuery.isSuccess).toBe(true);
      });

      expect(result.current.sitemapsQuery.data).toEqual([mockSitemap]);

      // Generate new sitemap
      result.current.generateSitemapMutation.mutate({ type: 'xml', pages: ['page1', 'page2'] });

      await waitFor(() => {
        expect(result.current.generateSitemapMutation.isSuccess).toBe(true);
      });

      // Submit sitemap to search engines
      const submitResult = await result.current.submitSitemap('1');
      expect(submitResult.success).toBe(true);
      expect(submitResult.submitted).toContain('google');
    });

    it('should handle meta tags optimization', async () => {
      const mockMetaTags = {
        id: '1',
        pageUrl: '/test-page',
        title: 'Test Page',
        description: 'Test description',
        keywords: ['test', 'keyword'],
        author: 'Test Author',
        viewport: 'width=device-width, initial-scale=1',
        charset: 'UTF-8',
        robots: 'index,follow',
        canonical: 'https://example.com/test-page',
        ogTitle: 'Test Page - OG',
        ogDescription: 'Test OG description',
        ogImage: 'https://example.com/image.jpg',
        ogType: 'website',
        ogUrl: 'https://example.com/test-page',
        twitterTitle: 'Test Page - Twitter',
        twitterDescription: 'Test Twitter description',
        twitterImage: 'https://example.com/twitter-image.jpg',
        twitterCard: 'summary_large_image',
        schemaMarkup: '{"@context":"https://schema.org","@type":"WebPage"}',
        hreflang: [{ language: 'zh-CN', url: 'https://example.com/zh/test-page' }],
        customTags: [{ name: 'custom-tag', content: 'custom-content' }],
        autoGenerate: false,
        lastGenerated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock meta tags operations
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [mockMetaTags] }) }) // Fetch meta tags
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockMetaTags }) }) // Create meta tags
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { title: 'Auto Generated', description: 'Auto description', keywords: ['auto', 'generated'] } }) }); // Auto-generate

      const { result } = renderHook(() => useSEOMetaTags(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.metaTagsQuery.isSuccess).toBe(true);
      });

      expect(result.current.metaTagsQuery.data).toEqual([mockMetaTags]);

      // Auto-generate meta tags from content
      const autoGenerated = await result.current.autoGenerateMetaTags('This is test content', '/test-page');
      expect(autoGenerated.title).toBe('Auto Generated');
      expect(autoGenerated.description).toBe('Auto description');
      expect(autoGenerated.keywords).toContain('auto');
    });

    it('should perform comprehensive SEO analysis', async () => {
      const mockAnalysis = {
        id: '1',
        pageUrl: '/test-page',
        overallScore: 85,
        pageSpeedScore: 90,
        mobileScore: 88,
        seoScore: 82,
        accessibilityScore: 85,
        bestPracticesScore: 87,
        issues: [
          {
            type: 'warning',
            category: 'meta-tags',
            message: 'Meta description could be longer',
            suggestion: 'Consider extending the meta description to 150-160 characters',
          },
        ],
        recommendations: [
          {
            category: 'content',
            priority: 'high',
            description: 'Add more internal links',
            impact: 'medium',
          },
        ],
        keywords: [
          {
            keyword: 'test keyword',
            density: 2.5,
            recommended: 3.0,
            status: 'good',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock analysis operations
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockAnalysis }) }) // Fetch analysis
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockAnalysis }) }); // Analyze page

      const { result } = renderHook(() => useSEOAnalysis(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.analysisQuery.isSuccess).toBe(true);
      });

      expect(result.current.analysisQuery.data).toEqual(mockAnalysis);

      // Analyze a specific page
      result.current.analyzePageMutation.mutate('/test-page');

      await waitFor(() => {
        expect(result.current.analyzePageMutation.isSuccess).toBe(true);
      });

      expect(result.current.analyzePageMutation.data?.overallScore).toBe(85);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle partial system failures gracefully', async () => {
      // Mock mixed success/failure responses
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: '1', siteName: 'Test Site' } }) }) // Settings success
        .mockRejectedValueOnce(new Error('Keywords service unavailable')) // Keywords failure
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) }) // Sitemaps success
        .mockRejectedValueOnce(new Error('Meta tags service error')) // Meta tags failure
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: null }) }); // Analysis success

      const { result: settingsResult } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });
      const { result: keywordsResult } = renderHook(() => useSEOKeywords(), { wrapper: createWrapper() });
      const { result: sitemapsResult } = renderHook(() => useSEOSitemaps(), { wrapper: createWrapper() });
      const { result: metaTagsResult } = renderHook(() => useSEOMetaTags(), { wrapper: createWrapper() });
      const { result: analysisResult } = renderHook(() => useSEOAnalysis(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(settingsResult.current.settingsQuery.isSuccess).toBe(true);
        expect(keywordsResult.current.keywordsQuery.isError).toBe(true);
        expect(sitemapsResult.current.sitemapsQuery.isSuccess).toBe(true);
        expect(metaTagsResult.current.metaTagsQuery.isError).toBe(true);
        expect(analysisResult.current.analysisQuery.isSuccess).toBe(true);
      });

      // Verify that successful services still work
      expect(settingsResult.current.settingsQuery.data).toBeTruthy();
      expect(sitemapsResult.current.sitemapsQuery.data).toEqual([]);
      expect(analysisResult.current.analysisQuery.data).toBeNull();

      // Verify error states
      expect(keywordsResult.current.keywordsQuery.error).toBeTruthy();
      expect(metaTagsResult.current.metaTagsQuery.error).toBeTruthy();
    });

    it('should recover from service failures', async () => {
      const mockSettings = { id: '1', siteName: 'Test Site' };

      // Initial failure
      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Service temporarily unavailable'));

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.settingsQuery.isError).toBe(true);
      });

      // Mock recovery
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockSettings }) });

      // Retry the query
      result.current.refetchSettings();

      await waitFor(() => {
        expect(result.current.settingsQuery.isSuccess).toBe(true);
      });

      expect(result.current.settingsQuery.data).toEqual(mockSettings);
    });
  });

  describe('Performance Integration', () => {
    it('should handle concurrent operations efficiently', async () => {
      const mockSettings = { id: '1', siteName: 'Test Site' };
      const mockKeywords = [{ id: '1', keyword: 'test', density: 2.5 }];
      const mockSitemaps = [{ id: '1', name: 'Main Sitemap' }];

      // Mock concurrent operations
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockSettings }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockKeywords }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockSitemaps }) });

      const startTime = Date.now();

      // Start all operations concurrently
      const settingsHook = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });
      const keywordsHook = renderHook(() => useSEOKeywords(), { wrapper: createWrapper() });
      const sitemapsHook = renderHook(() => useSEOSitemaps(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(settingsHook.result.current.settingsQuery.isSuccess).toBe(true);
        expect(keywordsHook.result.current.keywordsQuery.isSuccess).toBe(true);
        expect(sitemapsHook.result.current.sitemapsQuery.isSuccess).toBe(true);
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // All operations should complete reasonably quickly (within 1 second for mocked data)
      expect(duration).toBeLessThan(1000);

      // Verify all data is loaded
      expect(settingsHook.result.current.settingsQuery.data).toEqual(mockSettings);
      expect(keywordsHook.result.current.keywordsQuery.data).toEqual(mockKeywords);
      expect(sitemapsHook.result.current.sitemapsQuery.data).toEqual(mockSitemaps);
    });

    it('should implement proper caching across components', async () => {
      const mockSettings = { id: '1', siteName: 'Test Site' };

      // Mock settings fetch
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockSettings }) });

      const { result } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.settingsQuery.isSuccess).toBe(true);
      });

      // Clear fetch mock to track new calls
      (global.fetch as any).mockClear();

      // Create another hook instance - should use cache
      const { result: result2 } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result2.current.settingsQuery.isSuccess).toBe(true);
      });

      // Should not make additional network calls due to caching
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Data Consistency Integration', () => {
    it('should maintain consistency across related data', async () => {
      const mockSettings = { id: '1', siteName: 'Test Site', defaultLanguage: 'zh-CN' };
      const mockKeywords = [
        { id: '1', keyword: '中文关键词', category: 'primary' },
        { id: '2', keyword: 'test keyword', category: 'secondary' },
      ];

      // Mock related data
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockSettings }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockKeywords }) });

      const { result: settingsResult } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });
      const { result: keywordsResult } = renderHook(() => useSEOKeywords(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(settingsResult.current.settingsQuery.isSuccess).toBe(true);
        expect(keywordsResult.current.keywordsQuery.isSuccess).toBe(true);
      });

      // Verify data consistency
      expect(settingsResult.current.settingsQuery.data?.defaultLanguage).toBe('zh-CN');
      expect(keywordsResult.current.keywordsQuery.data).toContainEqual(
        expect.objectContaining({ keyword: '中文关键词' })
      );
    });

    it('should handle data dependencies correctly', async () => {
      // Mock sitemap generation depending on settings
      const mockSettings = { id: '1', siteName: 'Test Site', sitemapAutoSubmit: true };
      const mockSitemap = { id: '1', name: 'Main Sitemap', autoSubmit: true };

      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockSettings }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [mockSitemap] }) });

      const { result: settingsResult } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });
      const { result: sitemapsResult } = renderHook(() => useSEOSitemaps(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(settingsResult.current.settingsQuery.isSuccess).toBe(true);
        expect(sitemapsResult.current.sitemapsQuery.isSuccess).toBe(true);
      });

      // Verify dependency: sitemap auto-submit should match settings
      expect(settingsResult.current.settingsQuery.data?.sitemapAutoSubmit).toBe(true);
      expect(sitemapsResult.current.sitemapsQuery.data?.[0]?.autoSubmit).toBe(true);
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('should handle blog post SEO optimization workflow', async () => {
      // Simulate creating a new blog post with SEO optimization
      const blogPost = {
        title: 'How to Improve Your Website SEO',
        content: 'This comprehensive guide covers essential SEO techniques...',
        url: '/blog/improve-website-seo',
      };

      const mockAutoMetaTags = {
        title: 'How to Improve Your Website SEO - Complete Guide',
        description: 'This comprehensive guide covers essential SEO techniques for better rankings',
        keywords: ['SEO', 'website', 'improve', 'guide', 'techniques'],
      };

      const mockAnalysis = {
        overallScore: 88,
        issues: [],
        recommendations: [
          { category: 'content', priority: 'medium', description: 'Add more internal links' },
        ],
      };

      // Mock the workflow
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockAutoMetaTags }) }) // Auto-generate meta tags
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockAnalysis }) }); // Analyze content

      // Step 1: Auto-generate meta tags from content
      const autoMetaTags = await seoService.autoGenerateMetaTags(blogPost.content, blogPost.url);
      expect(autoMetaTags.title).toContain('SEO');
      expect(autoMetaTags.keywords).toContain('SEO');

      // Step 2: Analyze the content
      const analysis = await seoService.analyzePage('/blog/improve-website-seo');
      expect(analysis.overallScore).toBeGreaterThan(80);
    });

    it('should handle multilingual SEO setup', async () => {
      const multilingualSettings = {
        id: '1',
        siteName: 'Global Blog',
        defaultLanguage: 'zh-CN',
        enableMultilingual: true,
        hreflang: [
          { language: 'zh-CN', url: 'https://example.com/zh/' },
          { language: 'en-US', url: 'https://example.com/en/' },
          { language: 'ja-JP', url: 'https://example.com/ja/' },
        ],
      };

      const mockKeywords = [
        { id: '1', keyword: 'SEO优化', language: 'zh-CN' },
        { id: '2', keyword: 'SEO Optimization', language: 'en-US' },
        { id: '3', keyword: 'SEO最適化', language: 'ja-JP' },
      ];

      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: multilingualSettings }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockKeywords }) });

      const { result: settingsResult } = renderHook(() => useSEOSettings(), { wrapper: createWrapper() });
      const { result: keywordsResult } = renderHook(() => useSEOKeywords(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(settingsResult.current.settingsQuery.isSuccess).toBe(true);
        expect(keywordsResult.current.keywordsQuery.isSuccess).toBe(true);
      });

      // Verify multilingual setup
      expect(settingsResult.current.settingsQuery.data?.enableMultilingual).toBe(true);
      expect(settingsResult.current.settingsQuery.data?.hreflang).toHaveLength(3);
      expect(keywordsResult.current.keywordsQuery.data).toHaveLength(3);
    });
  });
});