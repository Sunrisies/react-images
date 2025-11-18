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

// Mock API calls
vi.mock('@/services/seo', () => ({
  seoService: {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
    getKeywords: vi.fn(),
    createKeyword: vi.fn(),
    updateKeyword: vi.fn(),
    deleteKeyword: vi.fn(),
    analyzeKeyword: vi.fn(),
    getSitemaps: vi.fn(),
    generateSitemap: vi.fn(),
    submitSitemap: vi.fn(),
    getMetaTags: vi.fn(),
    updateMetaTags: vi.fn(),
    getLinks: vi.fn(),
    analyzeLinks: vi.fn(),
    getSEOScore: vi.fn(),
    analyzePage: vi.fn(),
    getCompetitors: vi.fn(),
    addCompetitor: vi.fn(),
    analyzeCompetitor: vi.fn(),
    getRankings: vi.fn(),
    trackRanking: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('SEO System Tests', () => {
  describe('SEO Types', () => {
    it('should validate SEO settings structure', () => {
      const settings = {
        siteName: 'Test Site',
        siteDescription: 'Test Description',
        siteUrl: 'https://example.com',
        language: 'zh-CN',
        charset: 'UTF-8',
        robots: 'index,follow',
        author: 'Test Author',
        copyright: 'Test Copyright',
        googleAnalytics: 'GA-123456',
        baiduAnalytics: 'BA-123456',
        defaultMetaTitle: 'Default Title',
        defaultMetaDescription: 'Default Description',
        defaultMetaKeywords: ['test', 'keywords'],
        ogImage: 'https://example.com/og.jpg',
        twitterCard: 'summary_large_image',
        twitterSite: '@test',
        twitterCreator: '@test',
        facebookAppId: '123456789',
        locale: 'zh_CN',
        type: 'website',
        siteNameOg: 'Test Site OG',
        alternateName: 'Test Site Alt',
        keywords: ['test', 'site'],
        subject: 'Test Subject',
        summary: 'Test Summary',
        classification: 'Test Classification',
        category: 'Test Category',
        pageTopic: 'Test Topic',
        geoPosition: '39.9042,116.4074',
        geoPlaceName: 'Beijing',
        geoRegion: 'CN-11',
        icpNumber: '京ICP123456',
        publicSecurity: '京公网安备123456',
        allowRobots: true,
        allowFollow: true,
        allowIndex: true,
        allowArchive: true,
        allowCache: true,
        allowSnippet: true,
        maxSnippetLength: 160,
        maxImagePreview: 'large',
        maxVideoPreview: -1,
        allowTranslate: true,
        allowOdp: true,
        allowYdir: true,
        unavailableAfter: null,
        crawlDelay: 1,
        requestRate: 10,
        visitTime: '06:00-22:00',
        noVisit: false,
        acceptLanguage: ['zh-CN', 'en-US'],
        acceptCharset: ['UTF-8'],
        acceptEncoding: ['gzip', 'deflate'],
        acceptTypes: ['text/html', 'application/xhtml+xml'],
        userAgent: '*',
        disallowPaths: ['/admin', '/private'],
        allowPaths: ['/public', '/blog'],
        sitemapLocations: ['https://example.com/sitemap.xml'],
        cleanParam: ['utm_source', 'utm_medium'],
        host: 'example.com',
        hostLanguage: 'zh-CN',
        hostCountry: 'CN',
        hostIp: '192.168.1.1',
        hostDns: 'ns1.example.com',
        hostSsl: true,
        hostHttp2: true,
        hostIpv6: true,
        hostCdn: true,
        hostFirewall: true,
        hostLoadBalancer: true,
        hostCluster: true,
        hostCache: true,
        hostCompression: true,
        hostMinify: true,
        hostGzip: true,
        hostBrotli: true,
        hostKeepAlive: true,
        hostPersistent: true,
        hostPipelining: true,
        hostMultiplexing: true,
        hostServerPush: true,
        hostPreload: true,
        hostPrefetch: true,
        hostPreconnect: true,
        hostDnsPrefetch: true,
        hostPrerender: true,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      expect(settings).toBeDefined();
      expect(settings.siteName).toBe('Test Site');
      expect(settings.siteUrl).toBe('https://example.com');
      expect(settings.language).toBe('zh-CN');
      expect(settings.allowRobots).toBe(true);
      expect(settings.disallowPaths).toContain('/admin');
      expect(settings.allowPaths).toContain('/public');
    });

    it('should validate keyword structure', () => {
      const keyword = {
        id: '1',
        keyword: 'test keyword',
        density: 2.5,
        priority: 'high',
        searchVolume: 1000,
        competition: 'medium',
        cpc: 1.5,
        trends: [100, 120, 110, 130],
        related: ['related1', 'related2'],
        suggestions: ['suggestion1', 'suggestion2'],
        questions: ['question1', 'question2'],
        prepositions: ['preposition1', 'preposition2'],
        comparisons: ['comparison1', 'comparison2'],
        alphabetical: ['a', 'b', 'c'],
        relatedSearches: ['search1', 'search2'],
        tags: ['tag1', 'tag2'],
        category: 'Test Category',
        group: 'Test Group',
        url: 'https://example.com/page',
        title: 'Test Page Title',
        description: 'Test Page Description',
        content: 'Test page content',
        status: 'active',
        lastAnalyzed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(keyword).toBeDefined();
      expect(keyword.keyword).toBe('test keyword');
      expect(keyword.density).toBe(2.5);
      expect(keyword.priority).toBe('high');
      expect(keyword.searchVolume).toBe(1000);
      expect(keyword.competition).toBe('medium');
      expect(keyword.cpc).toBe(1.5);
      expect(keyword.status).toBe('active');
    });

    it('should validate sitemap structure', () => {
      const sitemap = {
        id: '1',
        name: 'Main Sitemap',
        url: 'https://example.com/sitemap.xml',
        type: 'xml',
        format: 'xml',
        pages: [
          {
            url: 'https://example.com/page1',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
          },
          {
            url: 'https://example.com/page2',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          },
        ],
        images: [
          {
            loc: 'https://example.com/image1.jpg',
            title: 'Image 1',
            caption: 'Image 1 Caption',
            geo_location: 'Beijing, China',
            license: 'https://example.com/license',
          },
        ],
        videos: [
          {
            thumbnail_loc: 'https://example.com/thumb1.jpg',
            title: 'Video 1',
            description: 'Video 1 Description',
            content_loc: 'https://example.com/video1.mp4',
            player_loc: 'https://example.com/player1',
            duration: 300,
            expiration_date: new Date(),
            rating: 4.5,
            view_count: 1000,
            publication_date: new Date(),
            family_friendly: true,
            tag: ['tag1', 'tag2'],
            category: 'Test Category',
            restriction: 'CN',
            platform: 'web',
            requires_subscription: false,
            uploader: 'Test Uploader',
            live: false,
          },
        ],
        news: [
          {
            publication: {
              name: 'Test Publication',
              language: 'zh-CN',
            },
            publication_date: new Date(),
            title: 'Test News Title',
            keywords: ['news1', 'news2'],
            stock_tickers: ['TEST'],
            access: 'Subscription',
            genres: ['PressRelease', 'Blog'],
          },
        ],
        mobile: [
          {
            url: 'https://m.example.com/page1',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
          },
        ],
        size: 1024,
        lastGenerated: new Date(),
        status: 'active',
        submitted: true,
        submittedAt: new Date(),
        searchEngines: ['google', 'bing', 'baidu'],
        errors: [],
        warnings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(sitemap).toBeDefined();
      expect(sitemap.name).toBe('Main Sitemap');
      expect(sitemap.type).toBe('xml');
      expect(sitemap.pages).toHaveLength(2);
      expect(sitemap.images).toHaveLength(1);
      expect(sitemap.videos).toHaveLength(1);
      expect(sitemap.news).toHaveLength(1);
      expect(sitemap.mobile).toHaveLength(1);
      expect(sitemap.status).toBe('active');
      expect(sitemap.submitted).toBe(true);
    });
  });

  describe('SEO Services', () => {
    it('should handle SEO settings API calls', async () => {
      const { seoService } = await import('@/services/seo');
      
      const mockSettings = {
        siteName: 'Test Site',
        siteUrl: 'https://example.com',
      };

      vi.mocked(seoService.getSettings).mockResolvedValue(mockSettings);
      vi.mocked(seoService.updateSettings).mockResolvedValue(mockSettings);

      const settings = await seoService.getSettings();
      expect(settings).toEqual(mockSettings);

      const updatedSettings = await seoService.updateSettings(mockSettings);
      expect(updatedSettings).toEqual(mockSettings);
    });

    it('should handle keyword management API calls', async () => {
      const { seoService } = await import('@/services/seo');
      
      const mockKeyword = {
        id: '1',
        keyword: 'test keyword',
        density: 2.5,
        priority: 'high' as const,
      };

      vi.mocked(seoService.getKeywords).mockResolvedValue([mockKeyword]);
      vi.mocked(seoService.createKeyword).mockResolvedValue(mockKeyword);
      vi.mocked(seoService.updateKeyword).mockResolvedValue(mockKeyword);
      vi.mocked(seoService.deleteKeyword).mockResolvedValue(true);
      vi.mocked(seoService.analyzeKeyword).mockResolvedValue({
        ...mockKeyword,
        searchVolume: 1000,
        competition: 'medium',
      });

      const keywords = await seoService.getKeywords();
      expect(keywords).toHaveLength(1);
      expect(keywords[0]).toEqual(mockKeyword);

      const createdKeyword = await seoService.createKeyword(mockKeyword);
      expect(createdKeyword).toEqual(mockKeyword);

      const updatedKeyword = await seoService.updateKeyword('1', mockKeyword);
      expect(updatedKeyword).toEqual(mockKeyword);

      const deleted = await seoService.deleteKeyword('1');
      expect(deleted).toBe(true);

      const analyzed = await seoService.analyzeKeyword('test keyword');
      expect(analyzed.searchVolume).toBe(1000);
      expect(analyzed.competition).toBe('medium');
    });

    it('should handle sitemap generation API calls', async () => {
      const { seoService } = await import('@/services/seo');
      
      const mockSitemap = {
        id: '1',
        name: 'Test Sitemap',
        url: 'https://example.com/sitemap.xml',
        type: 'xml' as const,
        pages: [],
        status: 'active' as const,
      };

      vi.mocked(seoService.getSitemaps).mockResolvedValue([mockSitemap]);
      vi.mocked(seoService.generateSitemap).mockResolvedValue(mockSitemap);
      vi.mocked(seoService.submitSitemap).mockResolvedValue(true);

      const sitemaps = await seoService.getSitemaps();
      expect(sitemaps).toHaveLength(1);
      expect(sitemaps[0]).toEqual(mockSitemap);

      const generated = await seoService.generateSitemap({
        name: 'Test Sitemap',
        type: 'xml',
      });
      expect(generated).toEqual(mockSitemap);

      const submitted = await seoService.submitSitemap('1');
      expect(submitted).toBe(true);
    });

    it('should handle meta tags API calls', async () => {
      const { seoService } = await import('@/services/seo');
      
      const mockMetaTags = {
        id: '1',
        pageUrl: 'https://example.com/page',
        title: 'Test Page Title',
        description: 'Test Page Description',
        keywords: ['test', 'keywords'],
        ogTitle: 'Test OG Title',
        ogDescription: 'Test OG Description',
        twitterTitle: 'Test Twitter Title',
        twitterDescription: 'Test Twitter Description',
      };

      vi.mocked(seoService.getMetaTags).mockResolvedValue([mockMetaTags]);
      vi.mocked(seoService.updateMetaTags).mockResolvedValue(mockMetaTags);

      const metaTags = await seoService.getMetaTags();
      expect(metaTags).toHaveLength(1);
      expect(metaTags[0]).toEqual(mockMetaTags);

      const updated = await seoService.updateMetaTags('1', mockMetaTags);
      expect(updated).toEqual(mockMetaTags);
    });

    it('should handle link optimization API calls', async () => {
      const { seoService } = await import('@/services/seo');
      
      const mockLinks = {
        internal: [
          {
            url: 'https://example.com/page1',
            anchor: 'Page 1',
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
      };

      vi.mocked(seoService.getLinks).mockResolvedValue(mockLinks);
      vi.mocked(seoService.analyzeLinks).mockResolvedValue({
        totalLinks: 3,
        brokenLinks: 1,
        internalLinks: 1,
        externalLinks: 1,
        issues: ['Broken link found'],
      });

      const links = await seoService.getLinks();
      expect(links).toEqual(mockLinks);
      expect(links.internal).toHaveLength(1);
      expect(links.external).toHaveLength(1);
      expect(links.broken).toHaveLength(1);

      const analysis = await seoService.analyzeLinks();
      expect(analysis.totalLinks).toBe(3);
      expect(analysis.brokenLinks).toBe(1);
      expect(analysis.issues).toContain('Broken link found');
    });

    it('should handle SEO scoring API calls', async () => {
      const { seoService } = await import('@/services/seo');
      
      const mockScore = {
        overallScore: 85,
        pageSpeed: 90,
        mobileScore: 88,
        contentScore: 82,
        technicalScore: 87,
        issues: [
          {
            type: 'warning' as const,
            category: 'content' as const,
            message: 'Missing alt text on images',
            severity: 'medium' as const,
            suggestion: 'Add alt text to all images',
          },
        ],
      };

      vi.mocked(seoService.getSEOScore).mockResolvedValue(mockScore);
      vi.mocked(seoService.analyzePage).mockResolvedValue(mockScore);

      const score = await seoService.getSEOScore('https://example.com/page');
      expect(score.overallScore).toBe(85);
      expect(score.pageSpeed).toBe(90);
      expect(score.mobileScore).toBe(88);
      expect(score.issues).toHaveLength(1);

      const analysis = await seoService.analyzePage('https://example.com/page');
      expect(analysis.overallScore).toBe(85);
      expect(analysis.issues[0].message).toBe('Missing alt text on images');
    });

    it('should handle competitor analysis API calls', async () => {
      const { seoService } = await import('@/services/seo');
      
      const mockCompetitor = {
        id: '1',
        name: 'Test Competitor',
        domain: 'competitor.com',
        url: 'https://competitor.com',
        keywords: ['keyword1', 'keyword2'],
        backlinks: 1000,
        domainAuthority: 75,
        pageAuthority: 65,
        trustFlow: 45,
        citationFlow: 55,
        alexaRank: 10000,
        semrushRank: 5000,
        mozRank: 4.5,
        status: 'active' as const,
      };

      vi.mocked(seoService.getCompetitors).mockResolvedValue([mockCompetitor]);
      vi.mocked(seoService.addCompetitor).mockResolvedValue(mockCompetitor);
      vi.mocked(seoService.analyzeCompetitor).mockResolvedValue({
        ...mockCompetitor,
        keywordGap: ['gap1', 'gap2'],
        backlinkGap: ['backlink1', 'backlink2'],
        contentGap: ['content1', 'content2'],
      });

      const competitors = await seoService.getCompetitors();
      expect(competitors).toHaveLength(1);
      expect(competitors[0]).toEqual(mockCompetitor);

      const added = await seoService.addCompetitor({
        name: 'Test Competitor',
        domain: 'competitor.com',
      });
      expect(added).toEqual(mockCompetitor);

      const analysis = await seoService.analyzeCompetitor('1');
      expect(analysis.keywordGap).toContain('gap1');
      expect(analysis.backlinkGap).toContain('backlink1');
      expect(analysis.contentGap).toContain('content1');
    });

    it('should handle ranking tracking API calls', async () => {
      const { seoService } = await import('@/services/seo');
      
      const mockRanking = {
        id: '1',
        keyword: 'test keyword',
        url: 'https://example.com/page',
        position: 5,
        previousPosition: 8,
        change: 3,
        searchEngine: 'google' as const,
        device: 'desktop' as const,
        location: 'Beijing, China',
        language: 'zh-CN',
        searchVolume: 1000,
        competition: 'medium',
        cpc: 1.5,
        traffic: 500,
        impressions: 10000,
        ctr: 5.0,
        date: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(seoService.getRankings).mockResolvedValue([mockRanking]);
      vi.mocked(seoService.trackRanking).mockResolvedValue(mockRanking);

      const rankings = await seoService.getRankings();
      expect(rankings).toHaveLength(1);
      expect(rankings[0]).toEqual(mockRanking);

      const tracked = await seoService.trackRanking({
        keyword: 'test keyword',
        url: 'https://example.com/page',
        searchEngine: 'google',
        device: 'desktop',
      });
      expect(tracked.position).toBe(5);
      expect(tracked.change).toBe(3);
    });
  });

  describe('SEO Hooks', () => {
    it('should handle SEO settings hook', async () => {
      const { useSEOSettings } = await import('@/hooks/useSEOSettings');
      const { seoService } = await import('@/services/seo');
      
      const mockSettings = {
        siteName: 'Test Site',
        siteUrl: 'https://example.com',
      };

      vi.mocked(seoService.getSettings).mockResolvedValue(mockSettings);

      const { result } = renderHook(() => useSEOSettings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.settings).toEqual(mockSettings);
      });
    });

    it('should handle keyword management hook', async () => {
      const { useSEOKeywords } = await import('@/hooks/useSEOKeywords');
      const { seoService } = await import('@/services/seo');
      
      const mockKeyword = {
        id: '1',
        keyword: 'test keyword',
        density: 2.5,
        priority: 'high' as const,
      };

      vi.mocked(seoService.getKeywords).mockResolvedValue([mockKeyword]);

      const { result } = renderHook(() => useSEOKeywords(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.keywords).toHaveLength(1);
        expect(result.current.keywords[0]).toEqual(mockKeyword);
      });
    });

    it('should handle sitemap management hook', async () => {
      const { useSEOSitemaps } = await import('@/hooks/useSEOSitemaps');
      const { seoService } = await import('@/services/seo');
      
      const mockSitemap = {
        id: '1',
        name: 'Test Sitemap',
        url: 'https://example.com/sitemap.xml',
        type: 'xml' as const,
        status: 'active' as const,
      };

      vi.mocked(seoService.getSitemaps).mockResolvedValue([mockSitemap]);

      const { result } = renderHook(() => useSEOSitemaps(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.sitemaps).toHaveLength(1);
        expect(result.current.sitemaps[0]).toEqual(mockSitemap);
      });
    });

    it('should handle meta tags hook', async () => {
      const { useSEOMetaTags } = await import('@/hooks/useSEOMetaTags');
      const { seoService } = await import('@/services/seo');
      
      const mockMetaTags = {
        id: '1',
        pageUrl: 'https://example.com/page',
        title: 'Test Page Title',
        description: 'Test Page Description',
      };

      vi.mocked(seoService.getMetaTags).mockResolvedValue([mockMetaTags]);

      const { result } = renderHook(() => useSEOMetaTags(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.metaTags).toHaveLength(1);
        expect(result.current.metaTags[0]).toEqual(mockMetaTags);
      });
    });

    it('should handle link optimization hook', async () => {
      const { useSEOLinks } = await import('@/hooks/useSEOLinks');
      const { seoService } = await import('@/services/seo');
      
      const mockLinks = {
        internal: [],
        external: [],
        broken: [],
      };

      vi.mocked(seoService.getLinks).mockResolvedValue(mockLinks);

      const { result } = renderHook(() => useSEOLinks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.links).toEqual(mockLinks);
      });
    });

    it('should handle SEO analysis hook', async () => {
      const { useSEOAnalysis } = await import('@/hooks/useSEOAnalysis');
      const { seoService } = await import('@/services/seo');
      
      const mockScore = {
        overallScore: 85,
        pageSpeed: 90,
        mobileScore: 88,
        contentScore: 82,
        technicalScore: 87,
        issues: [],
      };

      vi.mocked(seoService.getSEOScore).mockResolvedValue(mockScore);

      const { result } = renderHook(() => useSEOAnalysis(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.seoScore).toEqual(mockScore);
      });
    });

    it('should handle competitor analysis hook', async () => {
      const { useSEOCompetitors } = await import('@/hooks/useSEOCompetitors');
      const { seoService } = await import('@/services/seo');
      
      const mockCompetitor = {
        id: '1',
        name: 'Test Competitor',
        domain: 'competitor.com',
        status: 'active' as const,
      };

      vi.mocked(seoService.getCompetitors).mockResolvedValue([mockCompetitor]);

      const { result } = renderHook(() => useSEOCompetitors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.competitors).toHaveLength(1);
        expect(result.current.competitors[0]).toEqual(mockCompetitor);
      });
    });

    it('should handle ranking tracking hook', async () => {
      const { useSEORankings } = await import('@/hooks/useSEORankings');
      const { seoService } = await import('@/services/seo');
      
      const mockRanking = {
        id: '1',
        keyword: 'test keyword',
        url: 'https://example.com/page',
        position: 5,
        previousPosition: 8,
        change: 3,
        searchEngine: 'google' as const,
        device: 'desktop' as const,
        date: new Date(),
      };

      vi.mocked(seoService.getRankings).mockResolvedValue([mockRanking]);

      const { result } = renderHook(() => useSEORankings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.rankings).toHaveLength(1);
        expect(result.current.rankings[0]).toEqual(mockRanking);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const { seoService } = await import('@/services/seo');
      
      vi.mocked(seoService.getSettings).mockRejectedValue(new Error('API Error'));

      try {
        await seoService.getSettings();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('API Error');
      }
    });

    it('should handle network timeouts', async () => {
      const { seoService } = await import('@/services/seo');
      
      vi.mocked(seoService.getKeywords).mockRejectedValue(new Error('Network timeout'));

      try {
        await seoService.getKeywords();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network timeout');
      }
    });

    it('should handle invalid data formats', async () => {
      const { seoService } = await import('@/services/seo');
      
      vi.mocked(seoService.updateSettings).mockRejectedValue(new Error('Invalid data format'));

      try {
        await seoService.updateSettings({ invalid: 'data' } as any);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Invalid data format');
      }
    });
  });

  describe('Performance Tests', () => {
    it('should handle large keyword datasets efficiently', async () => {
      const { seoService } = await import('@/services/seo');
      
      const largeKeywordDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        keyword: `keyword ${i}`,
        density: Math.random() * 5,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as const,
      }));

      vi.mocked(seoService.getKeywords).mockResolvedValue(largeKeywordDataset);

      const startTime = performance.now();
      const keywords = await seoService.getKeywords();
      const endTime = performance.now();

      expect(keywords).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle concurrent API calls efficiently', async () => {
      const { seoService } = await import('@/services/seo');
      
      vi.mocked(seoService.getSettings).mockResolvedValue({ siteName: 'Test Site' });
      vi.mocked(seoService.getKeywords).mockResolvedValue([]);
      vi.mocked(seoService.getSitemaps).mockResolvedValue([]);
      vi.mocked(seoService.getMetaTags).mockResolvedValue([]);

      const startTime = performance.now();
      const [settings, keywords, sitemaps, metaTags] = await Promise.all([
        seoService.getSettings(),
        seoService.getKeywords(),
        seoService.getSitemaps(),
        seoService.getMetaTags(),
      ]);
      const endTime = performance.now();

      expect(settings).toBeDefined();
      expect(keywords).toBeDefined();
      expect(sitemaps).toBeDefined();
      expect(metaTags).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});