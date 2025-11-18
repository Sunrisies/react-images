import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock toast notifications
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock SEO services with realistic responses
vi.mock('@/services/seo', () => ({
  seoService: {
    getSettings: vi.fn().mockResolvedValue({
      siteName: 'Test Site',
      siteUrl: 'https://example.com',
      language: 'zh-CN',
      defaultMetaTitle: 'Default Title',
      defaultMetaDescription: 'Default Description',
    }),
    updateSettings: vi.fn().mockImplementation((settings) => Promise.resolve(settings)),
    getKeywords: vi.fn().mockResolvedValue([
      {
        id: '1',
        keyword: 'test keyword',
        density: 2.5,
        priority: 'high',
        searchVolume: 1000,
        competition: 'medium',
        status: 'active',
      },
      {
        id: '2',
        keyword: 'another keyword',
        density: 1.8,
        priority: 'medium',
        searchVolume: 800,
        competition: 'low',
        status: 'active',
      },
    ]),
    createKeyword: vi.fn().mockImplementation((keyword) => 
      Promise.resolve({ ...keyword, id: '3' })
    ),
    updateKeyword: vi.fn().mockImplementation((id, keyword) => 
      Promise.resolve({ ...keyword, id })
    ),
    deleteKeyword: vi.fn().mockResolvedValue(true),
    analyzeKeyword: vi.fn().mockImplementation((keyword) => 
      Promise.resolve({
        id: '1',
        keyword,
        density: 2.5,
        priority: 'high',
        searchVolume: 1000,
        competition: 'medium',
        trends: [100, 120, 110, 130],
        related: ['related1', 'related2'],
        suggestions: ['suggestion1', 'suggestion2'],
      })
    ),
    getSitemaps: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Main Sitemap',
        url: 'https://example.com/sitemap.xml',
        type: 'xml',
        pages: [
          {
            url: 'https://example.com/page1',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
          },
        ],
        status: 'active',
        submitted: true,
      },
    ]),
    generateSitemap: vi.fn().mockImplementation((config) =>
      Promise.resolve({
        id: '2',
        name: config.name,
        url: `https://example.com/${config.name.toLowerCase().replace(/\s+/g, '-')}-sitemap.xml`,
        type: config.type,
        pages: [],
        status: 'active',
        submitted: false,
      })
    ),
    submitSitemap: vi.fn().mockResolvedValue(true),
    getMetaTags: vi.fn().mockResolvedValue([
      {
        id: '1',
        pageUrl: 'https://example.com/page1',
        title: 'Page 1 Title',
        description: 'Page 1 Description',
        keywords: ['keyword1', 'keyword2'],
        ogTitle: 'Page 1 OG Title',
        ogDescription: 'Page 1 OG Description',
      },
    ]),
    updateMetaTags: vi.fn().mockImplementation((id, metaTags) =>
      Promise.resolve({ ...metaTags, id })
    ),
    getLinks: vi.fn().mockResolvedValue({
      internal: [
        {
          url: 'https://example.com/page1',
          anchor: 'Page 1',
          status: 'active',
        },
        {
          url: 'https://example.com/page2',
          anchor: 'Page 2',
          status: 'active',
        },
      ],
      external: [
        {
          url: 'https://external.com/page',
          anchor: 'External Page',
          status: 'active',
          nofollow: true,
        },
      ],
      broken: [
        {
          url: 'https://example.com/broken',
          anchor: 'Broken Link',
          status: 'broken',
          error: '404 Not Found',
        },
      ],
    }),
    analyzeLinks: vi.fn().mockResolvedValue({
      totalLinks: 4,
      brokenLinks: 1,
      internalLinks: 2,
      externalLinks: 1,
      issues: ['Broken link found', 'Missing alt text'],
    }),
    getSEOScore: vi.fn().mockResolvedValue({
      overallScore: 85,
      pageSpeed: 90,
      mobileScore: 88,
      contentScore: 82,
      technicalScore: 87,
      issues: [
        {
          type: 'warning',
          category: 'content',
          message: 'Missing alt text on images',
          severity: 'medium',
          suggestion: 'Add alt text to all images',
        },
      ],
    }),
    analyzePage: vi.fn().mockImplementation((url) =>
      Promise.resolve({
        overallScore: 85,
        pageSpeed: 90,
        mobileScore: 88,
        contentScore: 82,
        technicalScore: 87,
        issues: [
          {
            type: 'warning',
            category: 'content',
            message: `Missing alt text on ${url}`,
            severity: 'medium',
            suggestion: 'Add alt text to all images',
          },
        ],
      })
    ),
    getCompetitors: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Competitor 1',
        domain: 'competitor1.com',
        url: 'https://competitor1.com',
        keywords: ['keyword1', 'keyword2'],
        backlinks: 1000,
        domainAuthority: 75,
        pageAuthority: 65,
        status: 'active',
      },
      {
        id: '2',
        name: 'Competitor 2',
        domain: 'competitor2.com',
        url: 'https://competitor2.com',
        keywords: ['keyword3', 'keyword4'],
        backlinks: 800,
        domainAuthority: 70,
        pageAuthority: 60,
        status: 'active',
      },
    ]),
    addCompetitor: vi.fn().mockImplementation((competitor) =>
      Promise.resolve({ ...competitor, id: '3' })
    ),
    analyzeCompetitor: vi.fn().mockImplementation((id) => {
      const competitors = [
        {
          id: '1',
          keywordGap: ['gap1', 'gap2'],
          backlinkGap: ['backlink1', 'backlink2'],
          contentGap: ['content1', 'content2'],
        },
        {
          id: '2',
          keywordGap: ['gap3', 'gap4'],
          backlinkGap: ['backlink3', 'backlink4'],
          contentGap: ['content3', 'content4'],
        },
      ];
      return Promise.resolve(competitors.find(c => c.id === id));
    }),
    getRankings: vi.fn().mockResolvedValue([
      {
        id: '1',
        keyword: 'test keyword',
        url: 'https://example.com/page1',
        position: 5,
        previousPosition: 8,
        change: 3,
        searchEngine: 'google',
        device: 'desktop',
        date: new Date(),
      },
      {
        id: '2',
        keyword: 'another keyword',
        url: 'https://example.com/page2',
        position: 12,
        previousPosition: 15,
        change: 3,
        searchEngine: 'google',
        device: 'mobile',
        date: new Date(),
      },
    ]),
    trackRanking: vi.fn().mockImplementation((ranking) =>
      Promise.resolve({ ...ranking, id: '3', date: new Date() })
    ),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('SEO System Integration Tests', () => {
  describe('End-to-End SEO Workflow', () => {
    it('should complete a full SEO optimization workflow', async () => {
      const { useSEOSettings } = await import('@/hooks/useSEOSettings');
      const { useSEOKeywords } = await import('@/hooks/useSEOKeywords');
      const { useSEOSitemaps } = await import('@/hooks/useSEOSitemaps');
      const { useSEOMetaTags } = await import('@/hooks/useSEOMetaTags');
      const { useSEOAnalysis } = await import('@/hooks/useSEOAnalysis');
      
      // Step 1: Load SEO settings
      const { result: settingsResult } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(settingsResult.current.settings).toBeDefined();
        expect(settingsResult.current.settings.siteName).toBe('Test Site');
      });

      // Step 2: Load keywords
      const { result: keywordsResult } = renderHook(() => useSEOKeywords(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(keywordsResult.current.keywords).toHaveLength(2);
        expect(keywordsResult.current.keywords[0].keyword).toBe('test keyword');
      });

      // Step 3: Load sitemaps
      const { result: sitemapsResult } = renderHook(() => useSEOSitemaps(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(sitemapsResult.current.sitemaps).toHaveLength(1);
        expect(sitemapsResult.current.sitemaps[0].name).toBe('Main Sitemap');
      });

      // Step 4: Load meta tags
      const { result: metaTagsResult } = renderHook(() => useSEOMetaTags(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(metaTagsResult.current.metaTags).toHaveLength(1);
        expect(metaTagsResult.current.metaTags[0].title).toBe('Page 1 Title');
      });

      // Step 5: Get SEO score
      const { result: analysisResult } = renderHook(() => useSEOAnalysis(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(analysisResult.current.seoScore).toBeDefined();
        expect(analysisResult.current.seoScore.overallScore).toBe(85);
      });
    });

    it('should handle keyword research and optimization workflow', async () => {
      const { useSEOKeywords } = await import('@/hooks/useSEOKeywords');
      const { seoService } = await import('@/services/seo');
      
      const { result } = renderHook(() => useSEOKeywords(), {
        wrapper: createWrapper(),
      });

      // Step 1: Load existing keywords
      await waitFor(() => {
        expect(result.current.keywords).toHaveLength(2);
      });

      // Step 2: Analyze a keyword
      const analysisResult = await result.current.analyzeKeyword('test keyword');
      expect(analysisResult).toBeDefined();
      expect(analysisResult.searchVolume).toBe(1000);
      expect(analysisResult.competition).toBe('medium');

      // Step 3: Create a new keyword
      const newKeyword = {
        keyword: 'new keyword',
        priority: 'high' as const,
        density: 1.5,
      };

      const createdKeyword = await result.current.createKeyword(newKeyword);
      expect(createdKeyword).toBeDefined();
      expect(createdKeyword.id).toBe('3');
      expect(createdKeyword.keyword).toBe('new keyword');

      // Step 4: Update existing keyword
      const updatedKeyword = await result.current.updateKeyword('1', {
        ...result.current.keywords[0],
        priority: 'medium' as const,
      });
      expect(updatedKeyword.priority).toBe('medium');

      // Step 5: Delete a keyword
      const deleted = await result.current.deleteKeyword('2');
      expect(deleted).toBe(true);
    });

    it('should handle sitemap generation and submission workflow', async () => {
      const { useSEOSitemaps } = await import('@/hooks/useSEOSitemaps');
      const { seoService } = await import('@/services/seo');
      
      const { result } = renderHook(() => useSEOSitemaps(), {
        wrapper: createWrapper(),
      });

      // Step 1: Load existing sitemaps
      await waitFor(() => {
        expect(result.current.sitemaps).toHaveLength(1);
      });

      // Step 2: Generate a new sitemap
      const newSitemap = await result.current.generateSitemap({
        name: 'Blog Sitemap',
        type: 'xml' as const,
      });
      expect(newSitemap).toBeDefined();
      expect(newSitemap.name).toBe('Blog Sitemap');
      expect(newSitemap.type).toBe('xml');

      // Step 3: Submit sitemap to search engines
      const submitted = await result.current.submitSitemap('1');
      expect(submitted).toBe(true);

      // Step 4: Validate sitemap
      const validationResult = await result.current.validateSitemap('1');
      expect(validationResult).toBeDefined();
    });

    it('should handle meta tags optimization workflow', async () => {
      const { useSEOMetaTags } = await import('@/hooks/useSEOMetaTags');
      const { seoService } = await import('@/services/seo');
      
      const { result } = renderHook(() => useSEOMetaTags(), {
        wrapper: createWrapper(),
      });

      // Step 1: Load existing meta tags
      await waitFor(() => {
        expect(result.current.metaTags).toHaveLength(1);
      });

      // Step 2: Update meta tags
      const updatedMetaTags = await result.current.updateMetaTags('1', {
        title: 'Updated Page Title',
        description: 'Updated Page Description',
        keywords: ['updated1', 'updated2'],
        ogTitle: 'Updated OG Title',
        ogDescription: 'Updated OG Description',
      });
      expect(updatedMetaTags.title).toBe('Updated Page Title');

      // Step 3: Generate meta tags automatically
      const generatedMetaTags = await result.current.generateMetaTags(
        'https://example.com/new-page',
        'This is the page content with important keywords'
      );
      expect(generatedMetaTags).toBeDefined();

      // Step 4: Validate meta tags
      const validationResult = await result.current.validateMetaTags('1');
      expect(validationResult).toBeDefined();
    });

    it('should handle link analysis and optimization workflow', async () => {
      const { useSEOLinks } = await import('@/hooks/useSEOLinks');
      const { seoService } = await import('@/services/seo');
      
      const { result } = renderHook(() => useSEOLinks(), {
        wrapper: createWrapper(),
      });

      // Step 1: Load link data
      await waitFor(() => {
        expect(result.current.links).toBeDefined();
        expect(result.current.links.internal).toHaveLength(2);
        expect(result.current.links.external).toHaveLength(1);
        expect(result.current.links.broken).toHaveLength(1);
      });

      // Step 2: Analyze links
      const analysisResult = await result.current.analyzeLinks();
      expect(analysisResult).toBeDefined();
      expect(analysisResult.totalLinks).toBe(4);
      expect(analysisResult.brokenLinks).toBe(1);
      expect(analysisResult.issues).toHaveLength(2);

      // Step 3: Fix broken link
      const fixedLink = await result.current.fixBrokenLink('https://example.com/broken');
      expect(fixedLink).toBeDefined();

      // Step 4: Get internal link suggestions
      const suggestions = await result.current.suggestInternalLinks(
        'https://example.com/page1'
      );
      expect(suggestions).toBeDefined();
    });

    it('should handle competitor analysis workflow', async () => {
      const { useSEOCompetitors } = await import('@/hooks/useSEOCompetitors');
      const { seoService } = await import('@/services/seo');
      
      const { result } = renderHook(() => useSEOCompetitors(), {
        wrapper: createWrapper(),
      });

      // Step 1: Load existing competitors
      await waitFor(() => {
        expect(result.current.competitors).toHaveLength(2);
      });

      // Step 2: Add a new competitor
      const newCompetitor = await result.current.addCompetitor({
        name: 'New Competitor',
        domain: 'newcompetitor.com',
      });
      expect(newCompetitor).toBeDefined();
      expect(newCompetitor.id).toBe('3');

      // Step 3: Analyze competitor
      const analysisResult = await result.current.analyzeCompetitor('1');
      expect(analysisResult).toBeDefined();
      expect(analysisResult.keywordGap).toContain('gap1');
      expect(analysisResult.backlinkGap).toContain('backlink1');

      // Step 4: Compare keywords with competitor
      const keywordComparison = await result.current.compareKeywords('1');
      expect(keywordComparison).toBeDefined();

      // Step 5: Compare backlinks with competitor
      const backlinkComparison = await result.current.compareBacklinks('1');
      expect(backlinkComparison).toBeDefined();
    });

    it('should handle ranking tracking workflow', async () => {
      const { useSEORankings } = await import('@/hooks/useSEORankings');
      const { seoService } = await import('@/services/seo');
      
      const { result } = renderHook(() => useSEORankings(), {
        wrapper: createWrapper(),
      });

      // Step 1: Load existing rankings
      await waitFor(() => {
        expect(result.current.rankings).toHaveLength(2);
      });

      // Step 2: Track a new ranking
      const newRanking = await result.current.trackRanking({
        keyword: 'new ranking keyword',
        url: 'https://example.com/new-page',
        searchEngine: 'google' as const,
        device: 'desktop' as const,
      });
      expect(newRanking).toBeDefined();
      expect(newRanking.id).toBe('3');

      // Step 3: Get historical ranking data
      const historicalData = await result.current.getHistoricalData('1');
      expect(historicalData).toBeDefined();

      // Step 4: Export rankings
      const exportResult = await result.current.exportRankings();
      expect(exportResult).toBeDefined();
    });
  });

  describe('Performance and Caching Tests', () => {
    it('should handle concurrent data loading efficiently', async () => {
      const { useSEOSettings } = await import('@/hooks/useSEOSettings');
      const { useSEOKeywords } = await import('@/hooks/useSEOKeywords');
      const { useSEOSitemaps } = await import('@/hooks/useSEOSitemaps');
      const { useSEOMetaTags } = await import('@/hooks/useSEOMetaTags');
      
      const startTime = performance.now();

      const [
        { result: settingsResult },
        { result: keywordsResult },
        { result: sitemapsResult },
        { result: metaTagsResult },
      ] = await Promise.all([
        renderHook(() => useSEOSettings(), { wrapper: createWrapper() }),
        renderHook(() => useSEOKeywords(), { wrapper: createWrapper() }),
        renderHook(() => useSEOSitemaps(), { wrapper: createWrapper() }),
        renderHook(() => useSEOMetaTags(), { wrapper: createWrapper() }),
      ]);

      const endTime = performance.now();

      // All hooks should load data concurrently
      await waitFor(() => {
        expect(settingsResult.current.settings).toBeDefined();
        expect(keywordsResult.current.keywords).toBeDefined();
        expect(sitemapsResult.current.sitemaps).toBeDefined();
        expect(metaTagsResult.current.metaTags).toBeDefined();
      });

      // Should complete within reasonable time (2 seconds)
      expect(endTime - startTime).toBeLessThan(2000);
    });

    it('should handle large datasets efficiently', async () => {
      const { useSEOKeywords } = await import('@/hooks/useSEOKeywords');
      const { seoService } = await import('@/services/seo');
      
      // Mock large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        keyword: `keyword ${i}`,
        density: Math.random() * 5,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as const,
        searchVolume: Math.floor(Math.random() * 10000),
        competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as const,
        status: 'active' as const,
      }));

      vi.mocked(seoService.getKeywords).mockResolvedValueOnce(largeDataset);

      const startTime = performance.now();
      const { result } = renderHook(() => useSEOKeywords(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.keywords).toHaveLength(1000);
      });

      const endTime = performance.now();

      // Should handle large dataset efficiently (within 3 seconds)
      expect(endTime - startTime).toBeLessThan(3000);
    });

    it('should handle error recovery gracefully', async () => {
      const { useSEOSettings } = await import('@/hooks/useSEOSettings');
      const { seoService } = await import('@/services/seo');
      
      // Mock API failure
      vi.mocked(seoService.getSettings).mockRejectedValueOnce(new Error('API Error'));

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper(),
      });

      // Should handle error gracefully
      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      // Should recover on retry
      vi.mocked(seoService.getSettings).mockResolvedValueOnce({
        siteName: 'Recovered Site',
        siteUrl: 'https://recovered.com',
        language: 'zh-CN',
      });

      await result.current.updateSettings({
        siteName: 'New Site Name',
        siteUrl: 'https://newsite.com',
      });

      await waitFor(() => {
        expect(result.current.settings?.siteName).toBe('New Site Name');
      });
    });
  });

  describe('Data Consistency Tests', () => {
    it('should maintain data consistency across related hooks', async () => {
      const { useSEOKeywords } = await import('@/hooks/useSEOKeywords');
      const { useSEOAnalysis } = await import('@/hooks/useSEOAnalysis');
      const { seoService } = await import('@/services/seo');
      
      const { result: keywordsResult } = renderHook(() => useSEOKeywords(), {
        wrapper: createWrapper(),
      });

      const { result: analysisResult } = renderHook(() => useSEOAnalysis(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(keywordsResult.current.keywords).toHaveLength(2);
        expect(analysisResult.current.seoScore).toBeDefined();
      });

      // Keywords should be reflected in SEO analysis
      const keywords = keywordsResult.current.keywords;
      const seoScore = analysisResult.current.seoScore;

      expect(keywords).toHaveLength(2);
      expect(seoScore.overallScore).toBeGreaterThan(0);
    });

    it('should handle data synchronization between hooks', async () => {
      const { useSEOKeywords } = await import('@/hooks/useSEOKeywords');
      const { useSEOMetaTags } = await import('@/hooks/useSEOMetaTags');
      const { seoService } = await import('@/services/seo');
      
      const { result: keywordsResult } = renderHook(() => useSEOKeywords(), {
        wrapper: createWrapper(),
      });

      const { result: metaTagsResult } = renderHook(() => useSEOMetaTags(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(keywordsResult.current.keywords).toBeDefined();
        expect(metaTagsResult.current.metaTags).toBeDefined();
      });

      // Create a new keyword that should be available for meta tags
      const newKeyword = await keywordsResult.current.createKeyword({
        keyword: 'integration test keyword',
        priority: 'high' as const,
      });

      expect(newKeyword).toBeDefined();
      expect(newKeyword.keyword).toBe('integration test keyword');

      // Meta tags should be able to use the new keyword
      const updatedMetaTags = await metaTagsResult.current.updateMetaTags('1', {
        title: 'Integration Test Page',
        description: 'Page with integration test keyword',
        keywords: ['integration', 'test', 'keyword'],
      });

      expect(updatedMetaTags.keywords).toContain('integration');
      expect(updatedMetaTags.keywords).toContain('test');
      expect(updatedMetaTags.keywords).toContain('keyword');
    });
  });
});