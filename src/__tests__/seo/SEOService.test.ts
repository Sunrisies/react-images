import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { seoService } from '../../services/seo';
import { SEOSettings, SEOKeyword, SEOMetaTags, SEOSitemap } from '../../types/seo.types';

// Mock fetch API
global.fetch = vi.fn();

// Mock toast notifications
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

describe('SEOService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('SEO Settings', () => {
    const mockSettings: SEOSettings = {
      id: '1',
      siteName: 'Test Site',
      siteDescription: 'Test Description',
      siteUrl: 'https://example.com',
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

    it('should fetch SEO settings successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockSettings }),
      });

      const result = await seoService.getSettings();
      
      expect(result).toEqual(mockSettings);
      expect(global.fetch).toHaveBeenCalledWith('/api/seo/settings', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should handle fetch settings error', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(seoService.getSettings()).rejects.toThrow('Network error');
    });

    it('should update SEO settings successfully', async () => {
      const updatedSettings = { ...mockSettings, siteName: 'Updated Site' };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: updatedSettings }),
      });

      const result = await seoService.updateSettings(updatedSettings);
      
      expect(result).toEqual(updatedSettings);
      expect(global.fetch).toHaveBeenCalledWith('/api/seo/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
    });

    it('should validate robots.txt format', () => {
      const validRobotsTxt = 'User-agent: *\nAllow: /\nDisallow: /admin/';
      const invalidRobotsTxt = 'invalid robots content';

      expect(seoService.validateRobotsTxt(validRobotsTxt)).toBe(true);
      expect(seoService.validateRobotsTxt(invalidRobotsTxt)).toBe(false);
    });
  });

  describe('Keyword Management', () => {
    const mockKeywords: SEOKeyword[] = [
      {
        id: '1',
        keyword: 'test keyword',
        density: 2.5,
        competition: 'medium',
        searchVolume: 1000,
        cpc: 1.5,
        trends: [100, 120, 110, 130],
        category: 'test',
        tags: ['primary', 'important'],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    it('should fetch keywords successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockKeywords }),
      });

      const result = await seoService.getKeywords();
      
      expect(result).toEqual(mockKeywords);
      expect(global.fetch).toHaveBeenCalledWith('/api/seo/keywords', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should create keyword successfully', async () => {
      const newKeyword = { keyword: 'new keyword', category: 'test' };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { ...mockKeywords[0], ...newKeyword } }),
      });

      const result = await seoService.createKeyword(newKeyword);
      
      expect(result.keyword).toBe('new keyword');
      expect(global.fetch).toHaveBeenCalledWith('/api/seo/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKeyword),
      });
    });

    it('should update keyword successfully', async () => {
      const updatedKeyword = { ...mockKeywords[0], keyword: 'updated keyword' };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: updatedKeyword }),
      });

      const result = await seoService.updateKeyword('1', updatedKeyword);
      
      expect(result.keyword).toBe('updated keyword');
      expect(global.fetch).toHaveBeenCalledWith('/api/seo/keywords/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedKeyword),
      });
    });

    it('should delete keyword successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await seoService.deleteKeyword('1');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/seo/keywords/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should analyze keyword density', async () => {
      const content = 'This is test content with test keyword mentioned multiple times.';
      const keyword = 'test';
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { density: 3.5, count: 3 } }),
      });

      const result = await seoService.analyzeKeywordDensity(content, keyword);
      
      expect(result.density).toBe(3.5);
      expect(result.count).toBe(3);
    });

    it('should get keyword suggestions', async () => {
      const suggestions = ['suggestion 1', 'suggestion 2'];
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: suggestions }),
      });

      const result = await seoService.getKeywordSuggestions('test');
      
      expect(result).toEqual(suggestions);
    });

    it('should perform bulk keyword analysis', async () => {
      const keywords = ['keyword1', 'keyword2'];
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockKeywords }),
      });

      const result = await seoService.bulkAnalyzeKeywords(keywords);
      
      expect(result).toEqual(mockKeywords);
    });
  });

  describe('Sitemap Management', () => {
    const mockSitemap: SEOSitemap = {
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

    it('should fetch sitemaps successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockSitemap] }),
      });

      const result = await seoService.getSitemaps();
      
      expect(result).toEqual([mockSitemap]);
      expect(global.fetch).toHaveBeenCalledWith('/api/seo/sitemaps', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should generate sitemap successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockSitemap }),
      });

      const result = await seoService.generateSitemap('xml', ['page1', 'page2']);
      
      expect(result).toEqual(mockSitemap);
      expect(global.fetch).toHaveBeenCalledWith('/api/seo/sitemaps/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'xml', pages: ['page1', 'page2'] }),
      });
    });

    it('should validate sitemap XML', async () => {
      const validXml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>https://example.com</loc></url>\n</urlset>';
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { valid: true, errors: [] } }),
      });

      const result = await seoService.validateSitemap(validXml);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should submit sitemap to search engines', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { success: true, submitted: ['google', 'bing'] } }),
      });

      const result = await seoService.submitSitemap('1');
      
      expect(result.success).toBe(true);
      expect(result.submitted).toEqual(['google', 'bing']);
    });
  });

  describe('Meta Tags Management', () => {
    const mockMetaTags: SEOMetaTags = {
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

    it('should fetch meta tags successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockMetaTags] }),
      });

      const result = await seoService.getMetaTags();
      
      expect(result).toEqual([mockMetaTags]);
      expect(global.fetch).toHaveBeenCalledWith('/api/seo/meta-tags', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should create meta tags successfully', async () => {
      const newMetaTags = {
        pageUrl: '/new-page',
        title: 'New Page',
        description: 'New description',
      };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { ...mockMetaTags, ...newMetaTags } }),
      });

      const result = await seoService.createMetaTags(newMetaTags);
      
      expect(result.pageUrl).toBe('/new-page');
      expect(global.fetch).toHaveBeenCalledWith('/api/seo/meta-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMetaTags),
      });
    });

    it('should auto-generate meta tags from content', async () => {
      const content = 'This is a test content that should generate meta tags.';
      const pageUrl = '/test-content';
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          data: {
            title: 'Test Content',
            description: 'This is a test content that should generate meta tags.',
            keywords: ['test', 'content', 'generate', 'meta', 'tags'],
          }
        }),
      });

      const result = await seoService.autoGenerateMetaTags(content, pageUrl);
      
      expect(result.title).toBe('Test Content');
      expect(result.description).toContain('test content');
      expect(result.keywords).toContain('test');
    });

    it('should validate meta tags', async () => {
      const metaTags = {
        title: 'Test Title',
        description: 'Test description that is long enough.',
        keywords: ['test', 'keyword'],
      };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          data: {
            valid: true,
            warnings: ['Title could be longer'],
            errors: [],
          }
        }),
      });

      const result = await seoService.validateMetaTags(metaTags);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Title could be longer');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(seoService.getSettings()).rejects.toThrow('Network error');
    });

    it('should handle HTTP errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(seoService.getSettings()).rejects.toThrow('HTTP error! status: 404');
    });

    it('should handle invalid JSON responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); },
      });

      await expect(seoService.getSettings()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Caching Behavior', () => {
    it('should implement proper cache invalidation', async () => {
      // First call should fetch from server
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: '1', siteName: 'Test Site' } }),
      });

      await seoService.getSettings();
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call within cache time should not fetch again
      await seoService.getSettings();
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Wait for cache to expire (5 minutes for settings)
      vi.advanceTimersByTime(5 * 60 * 1000 + 1);

      // Third call should fetch again
      await seoService.getSettings();
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});