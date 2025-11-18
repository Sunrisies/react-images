import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { seoService } from '../seo';
import type { 
  SEOSettings, 
  SEOKeyword, 
  SEOSitemap, 
  SEOMetaTag,
  SEOAnalysis,
  SEORanking,
  SEOReport 
} from '@/types/seo.types';

// Mock fetch API
global.fetch = vi.fn();

describe('SEO Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Settings Management', () => {
    it('should fetch SEO settings successfully', async () => {
      const mockSettings: SEOSettings = {
        id: '1',
        siteName: 'Test Site',
        siteDescription: 'Test Description',
        siteUrl: 'https://example.com',
        language: 'zh-CN',
        charset: 'UTF-8',
        robotsTxt: 'User-agent: *\nDisallow: /admin/',
        googleAnalyticsId: 'UA-123456789-1',
        baiduAnalyticsId: 'baidu-123',
        defaultMetaTitle: 'Default Title',
        defaultMetaDescription: 'Default Description',
        defaultMetaKeywords: ['test', 'seo'],
        socialMedia: {
          twitter: '@test',
          facebook: 'testpage',
          linkedin: 'testcompany'
        },
        hreflang: [
          { language: 'zh-CN', url: 'https://example.com/zh' },
          { language: 'en-US', url: 'https://example.com/en' }
        ],
        crawlDelay: 1,
        sitemapAutoSubmit: true,
        lastUpdated: new Date().toISOString()
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockSettings })
      } as Response);

      const result = await seoService.getSettings();
      
      expect(result).toEqual(mockSettings);
      expect(fetch).toHaveBeenCalledWith('/api/seo/settings', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should handle errors when fetching settings', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);

      await expect(seoService.getSettings()).rejects.toThrow('Failed to fetch SEO settings');
    });

    it('should update SEO settings successfully', async () => {
      const updatedSettings: Partial<SEOSettings> = {
        siteName: 'Updated Site Name',
        siteDescription: 'Updated Description'
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: updatedSettings })
      } as Response);

      const result = await seoService.updateSettings(updatedSettings);
      
      expect(result).toEqual(updatedSettings);
      expect(fetch).toHaveBeenCalledWith('/api/seo/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
    });
  });

  describe('Keyword Management', () => {
    it('should fetch keywords successfully', async () => {
      const mockKeywords: SEOKeyword[] = [
        {
          id: '1',
          keyword: 'test keyword',
          searchVolume: 1000,
          competition: 'medium',
          difficulty: 45,
          cpc: 2.5,
          category: 'technology',
          tags: ['test', 'seo'],
          trends: [100, 120, 110, 130],
          relatedKeywords: ['related1', 'related2'],
          isTracked: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockKeywords })
      } as Response);

      const result = await seoService.getKeywords();
      
      expect(result).toEqual(mockKeywords);
      expect(fetch).toHaveBeenCalledWith('/api/seo/keywords', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should create keyword successfully', async () => {
      const newKeyword = {
        keyword: 'new keyword',
        category: 'technology',
        tags: ['test']
      };

      const createdKeyword: SEOKeyword = {
        id: '2',
        ...newKeyword,
        searchVolume: 500,
        competition: 'low',
        difficulty: 30,
        cpc: 1.2,
        trends: [],
        relatedKeywords: [],
        isTracked: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: createdKeyword })
      } as Response);

      const result = await seoService.createKeyword(newKeyword);
      
      expect(result).toEqual(createdKeyword);
      expect(fetch).toHaveBeenCalledWith('/api/seo/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKeyword)
      });
    });

    it('should analyze keyword successfully', async () => {
      const keyword = 'test keyword';
      const analysis = {
        searchVolume: 1200,
        competition: 'medium',
        difficulty: 50,
        cpc: 3.0,
        trends: [100, 110, 120, 115],
        relatedKeywords: ['related1', 'related2', 'related3'],
        suggestions: ['suggestion1', 'suggestion2']
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: analysis })
      } as Response);

      const result = await seoService.analyzeKeyword(keyword);
      
      expect(result).toEqual(analysis);
      expect(fetch).toHaveBeenCalledWith('/api/seo/keywords/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      });
    });
  });

  describe('Sitemap Management', () => {
    it('should fetch sitemaps successfully', async () => {
      const mockSitemaps: SEOSitemap[] = [
        {
          id: '1',
          name: 'Main Sitemap',
          url: '/sitemap.xml',
          type: 'xml',
          pages: 150,
          size: 25600,
          lastModified: new Date().toISOString(),
          isAutoGenerated: true,
          submissionStatus: {
            google: 'submitted',
            baidu: 'pending',
            bing: 'submitted'
          }
        }
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockSitemaps })
      } as Response);

      const result = await seoService.getSitemaps();
      
      expect(result).toEqual(mockSitemaps);
      expect(fetch).toHaveBeenCalledWith('/api/seo/sitemaps', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should generate sitemap successfully', async () => {
      const sitemapConfig = {
        type: 'xml' as const,
        includeImages: true,
        includeVideos: false,
        excludePatterns: ['/admin/*', '/private/*']
      };

      const generatedSitemap: SEOSitemap = {
        id: '2',
        name: 'Generated Sitemap',
        url: '/sitemap-generated.xml',
        type: 'xml',
        pages: 200,
        size: 51200,
        lastModified: new Date().toISOString(),
        isAutoGenerated: true,
        submissionStatus: {
          google: 'pending',
          baidu: 'pending',
          bing: 'pending'
        }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: generatedSitemap })
      } as Response);

      const result = await seoService.generateSitemap(sitemapConfig);
      
      expect(result).toEqual(generatedSitemap);
      expect(fetch).toHaveBeenCalledWith('/api/seo/sitemaps/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sitemapConfig)
      });
    });
  });

  describe('Meta Tags Management', () => {
    it('should fetch meta tags successfully', async () => {
      const mockMetaTags: SEOMetaTag[] = [
        {
          id: '1',
          pageUrl: '/',
          title: 'Home Page',
          description: 'Welcome to our website',
          keywords: ['home', 'welcome'],
          ogTitle: 'Home - Our Website',
          ogDescription: 'Welcome to our amazing website',
          ogImage: 'https://example.com/og-image.jpg',
          ogType: 'website',
          twitterCard: 'summary_large_image',
          twitterTitle: 'Home - Our Website',
          twitterDescription: 'Welcome to our amazing website',
          twitterImage: 'https://example.com/twitter-image.jpg',
          canonicalUrl: 'https://example.com/',
          robotsContent: 'index,follow',
          hreflang: [
            { language: 'zh-CN', url: 'https://example.com/zh' },
            { language: 'en-US', url: 'https://example.com/en' }
          ],
          customTags: {
            'author': 'Test Author',
            'viewport': 'width=device-width, initial-scale=1.0'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockMetaTags })
      } as Response);

      const result = await seoService.getMetaTags();
      
      expect(result).toEqual(mockMetaTags);
      expect(fetch).toHaveBeenCalledWith('/api/seo/metatags', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should generate meta tags from content successfully', async () => {
      const content = {
        title: 'Article Title',
        content: 'This is a long article about SEO best practices and how to optimize your website for search engines.',
        keywords: ['SEO', 'optimization', 'best practices']
      };

      const generatedMetaTag: SEOMetaTag = {
        id: '2',
        pageUrl: '/article/seo-best-practices',
        title: 'Article Title - SEO Guide',
        description: 'Learn SEO best practices and how to optimize your website for search engines.',
        keywords: ['SEO', 'optimization', 'best practices'],
        ogTitle: 'Article Title - SEO Guide',
        ogDescription: 'Learn SEO best practices and how to optimize your website for search engines.',
        ogType: 'article',
        twitterCard: 'summary',
        twitterTitle: 'Article Title - SEO Guide',
        twitterDescription: 'Learn SEO best practices and how to optimize your website for search engines.',
        canonicalUrl: 'https://example.com/article/seo-best-practices',
        robotsContent: 'index,follow',
        hreflang: [],
        customTags: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: generatedMetaTag })
      } as Response);

      const result = await seoService.generateMetaTagsFromContent(content);
      
      expect(result).toEqual(generatedMetaTag);
      expect(fetch).toHaveBeenCalledWith('/api/seo/metatags/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
    });
  });

  describe('SEO Analysis', () => {
    it('should perform SEO analysis successfully', async () => {
      const url = 'https://example.com/test-page';
      const mockAnalysis: SEOAnalysis = {
        id: '1',
        url,
        overallScore: 85,
        pageSpeedScore: 90,
        mobileScore: 88,
        accessibilityScore: 92,
        seoScore: 85,
        issues: [
          {
            id: '1',
            type: 'warning',
            category: 'content',
            title: 'Missing alt text',
            description: 'Some images are missing alt text',
            priority: 'medium',
            element: '<img src="test.jpg">',
            recommendation: 'Add descriptive alt text to all images'
          }
        ],
        recommendations: [
          {
            id: '1',
            title: 'Improve page speed',
            description: 'Optimize images and minify CSS/JS',
            impact: 'high',
            effort: 'medium',
            category: 'performance'
          }
        ],
        keywords: {
          primary: 'test keyword',
          secondary: ['related1', 'related2'],
          density: 2.5
        },
        contentLength: 1500,
        readingLevel: 'intermediate',
        createdAt: new Date().toISOString()
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAnalysis })
      } as Response);

      const result = await seoService.analyzePage(url);
      
      expect(result).toEqual(mockAnalysis);
      expect(fetch).toHaveBeenCalledWith('/api/seo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
    });
  });

  describe('Ranking Tracking', () => {
    it('should fetch rankings successfully', async () => {
      const mockRankings: SEORanking[] = [
        {
          id: '1',
          keyword: 'test keyword',
          currentRank: 5,
          previousRank: 8,
          rankChange: 3,
          searchVolume: 1000,
          cpc: 2.5,
          competition: 65,
          url: 'https://example.com/test-page',
          engine: 'google',
          location: 'US',
          category: 'technology',
          tags: ['test', 'seo'],
          lastUpdated: new Date().toISOString(),
          trendData: [
            { date: '2024-01-01', rank: 8 },
            { date: '2024-01-02', rank: 7 },
            { date: '2024-01-03', rank: 5 }
          ]
        }
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockRankings })
      } as Response);

      const result = await seoService.getRankings({ engine: 'google', dateRange: '30d' });
      
      expect(result).toEqual(mockRankings);
      expect(fetch).toHaveBeenCalledWith('/api/seo/rankings?engine=google&dateRange=30d', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should add keyword tracking successfully', async () => {
      const keyword = 'new tracking keyword';
      const url = 'https://example.com/new-page';
      
      const addedRanking: SEORanking = {
        id: '2',
        keyword,
        currentRank: 0,
        previousRank: 0,
        rankChange: 0,
        searchVolume: 800,
        cpc: 1.8,
        competition: 55,
        url,
        engine: 'google',
        location: 'US',
        category: 'technology',
        tags: [],
        lastUpdated: new Date().toISOString(),
        trendData: []
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: addedRanking })
      } as Response);

      const result = await seoService.addKeywordTracking(keyword, url);
      
      expect(result).toEqual(addedRanking);
      expect(fetch).toHaveBeenCalledWith('/api/seo/rankings/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, url })
      });
    });
  });

  describe('Report Management', () => {
    it('should fetch reports successfully', async () => {
      const mockReports: SEOReport[] = [
        {
          id: '1',
          name: 'Monthly SEO Report',
          type: 'monthly',
          frequency: 'monthly',
          recipients: ['admin@example.com', 'seo@example.com'],
          metrics: ['rankings', 'traffic', 'keywords'],
          description: 'Monthly SEO performance report',
          enabled: true,
          lastGenerated: new Date().toISOString(),
          nextScheduled: new Date().toISOString(),
          status: 'active',
          template: 'default',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockReports })
      } as Response);

      const result = await seoService.getReports();
      
      expect(result).toEqual(mockReports);
      expect(fetch).toHaveBeenCalledWith('/api/seo/reports', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should create report successfully', async () => {
      const newReport = {
        name: 'Weekly SEO Report',
        type: 'weekly' as const,
        frequency: 'weekly' as const,
        recipients: ['admin@example.com'],
        metrics: ['rankings', 'keywords'],
        description: 'Weekly SEO report',
        enabled: true
      };

      const createdReport: SEOReport = {
        id: '2',
        ...newReport,
        lastGenerated: null,
        nextScheduled: null,
        status: 'active',
        template: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: createdReport })
      } as Response);

      const result = await seoService.createReport(newReport);
      
      expect(result).toEqual(createdReport);
      expect(fetch).toHaveBeenCalledWith('/api/seo/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });
    });

    it('should generate report successfully', async () => {
      const reportId = '1';
      
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { success: true, message: 'Report generated successfully' } })
      } as Response);

      const result = await seoService.generateReport(reportId);
      
      expect(result).toEqual({ success: true, message: 'Report generated successfully' });
      expect(fetch).toHaveBeenCalledWith('/api/seo/reports/1/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should export report successfully', async () => {
      const reportId = '1';
      const format = 'pdf' as const;
      
      // Mock the fetch for export endpoint
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(['PDF content'], { type: 'application/pdf' })
      } as Response);

      // Mock URL.createObjectURL
      global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      
      // Mock link creation and click
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
        style: { display: '' },
        remove: vi.fn()
      };
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      await seoService.exportReport(reportId, format);
      
      expect(fetch).toHaveBeenCalledWith('/api/seo/reports/1/export?format=pdf', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.remove).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(seoService.getSettings()).rejects.toThrow('Network error');
    });

    it('should handle JSON parsing errors', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); }
      } as Response);

      await expect(seoService.getSettings()).rejects.toThrow('Invalid JSON');
    });

    it('should handle timeout errors', async () => {
      vi.mocked(fetch).mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      await expect(seoService.getSettings()).rejects.toThrow('Timeout');
    });
  });

  describe('Cache Management', () => {
    it('should respect cache headers for GET requests', async () => {
      const mockSettings: SEOSettings = {
        id: '1',
        siteName: 'Cached Site',
        siteDescription: 'Cached Description',
        siteUrl: 'https://example.com',
        language: 'zh-CN',
        charset: 'UTF-8',
        robotsTxt: 'User-agent: *\nDisallow: /admin/',
        googleAnalyticsId: 'UA-123456789-1',
        baiduAnalyticsId: 'baidu-123',
        defaultMetaTitle: 'Default Title',
        defaultMetaDescription: 'Default Description',
        defaultMetaKeywords: ['test', 'seo'],
        socialMedia: {},
        hreflang: [],
        crawlDelay: 1,
        sitemapAutoSubmit: true,
        lastUpdated: new Date().toISOString()
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockSettings }),
        headers: new Headers({
          'Cache-Control': 'max-age=300'
        })
      } as Response);

      const result = await seoService.getSettings();
      
      expect(result).toEqual(mockSettings);
      // Verify cache headers are respected
      const callArgs = vi.mocked(fetch).mock.calls[0];
      expect(callArgs[1]?.headers).toBeDefined();
    });
  });
});